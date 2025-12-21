const axios = require('axios');
const Set = require('../models/Set');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const minioService = require('../services/minioService');

const host = 'https://rebrickable.com';

const getUserImageKey = (email) => email.replace(/[.@]/g, '');

const createError = (enMsg, bgMsg, language, statusCode) => {
  const error = new Error(language === 'en' ? enMsg : bgMsg);
  error.statusCode = statusCode;
  return error;
};

const baseReviewQuery = { review: { $ne: null } };
const API_HEADERS = {
  Authorization: `key ${process.env.REBRICKABLE_API_KEY}`,
};

exports.getAllWithReview = async (setNumber) => {
  const query = { ...baseReviewQuery };
  if (setNumber) {
    query.setNum = { $regex: setNumber };
  }

  const sets = await Set.find(query)
    .select('name image reviewDate')
    .populate('user', 'username email');

  return getUserImagesFromSets(sets);
};

exports.getUserCollection = async (username, language) => {
  const user = await User.findOne({
    normalizedUsername: username.toLowerCase()
  }).populate('sets');

  if (!user) {
    throw createError(
      'User not found!',
      'Потребителят не е намерен!',
      language,
      404
    );
  }

  const userImage = await minioService.getUserImage(
    getUserImageKey(user.email)
  );

  return {
    user: {
      image: userImage,
      username: user.username,
    },
    sets: user.sets,
  };
};

exports.addSet = async (setId, refreshToken, language) => {
  let foundSet;
  try {
    foundSet = await axios.get(`${host}/api/v3/lego/sets/${setId}-1/`, {
      headers: API_HEADERS
    })
  } catch {
    throw createError( // CHANGED: use helper
      'Set not found!',
      'Сетът не е намерен!',
      language,
      404
    );
  }

  const figs = await axios.get(
    `${host}/api/v3/lego/sets/${setId}-1/minifigs/`,
    {
      headers: API_HEADERS
    }
  );

  const user = await User.findOne({ refreshToken }).populate('sets');
  if (!user) {
    throw createError(
      'User not found!',
      'Потребителят не е намерен!',
      language,
      404
    );
  }

  const alreadyExists = user.sets.some(
    (set) => set.setNum === foundSet.data.set_num
  );
  if (alreadyExists) {
    throw createError(
      'Set already exists in collection!',
      'Сетът вече съществува в колекцията!',
      language,
      409
    );
  }

  const setData = {
    setNum: foundSet.data.set_num,
    name: foundSet.data.name,
    year: foundSet.data.year,
    parts: foundSet.data.num_parts,
    image: foundSet.data.set_img_url,
    minifigCount: figs.data.count,
    minifigs: figs.data.results.map((fig) => ({
      name: fig.set_name,
      quantity: fig.quantity,
      image: fig.set_img_url,
    })),
    user: user._id,
  };

  const set = await Set.create(setData);
  user.sets.push(set._id);
  await user.save();

  let sets = [...user.sets];
  const userSetsIndex = sets.findIndex((userSet) =>
    userSet._id.equals(set._id)
  );

  /* istanbul ignore next  */
  if (userSetsIndex !== -1) {
    sets[userSetsIndex] = {
      _id: sets[userSetsIndex]._id,
      ...setData,
    };
  }

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      sets: sets.map((set) => ({
        ...set,
        review: Boolean(set.review),
      })),
    },
  };
};

exports.deleteSet = async (setId, token, language) => {
  const payload = jwt.decode(token);
  const emailKey = getUserImageKey(payload.email);
  const id = payload._id;

  const set = await Set.findById(setId).populate('user');
  if (!set) {
    throw createError(
      'Set not found!',
      'Сетът не е намерен!',
      language,
      404
    );
  }

  if (set.user._id.toString() !== id) {
    throw createError(
      'You are not authorized to delete this set!',
      'Нямате права да изтриете този сет!',
      language,
      403
    );
  }

  if (set.review) {
    await minioService.deleteReviewImages(emailKey, set.setNum);
  }

  set.user.sets = set.user.sets.filter(
    (userSetId) => userSetId.toString() !== set._id.toString()
  );
  await set.user.save();
  await set.deleteOne();
  await set.user.populate('sets');

  return {
    user: {
      _id: set.user._id,
      username: set.user.username,
      email: set.user.email,
      sets: set.user.sets.map((set) => ({
        ...set.toObject(),
        review: Boolean(set.review),
      })),
    },
  };
};

/* istanbul ignore next  */
async function getUserImagesFromSets(sets) {
  const uniqueKeys = [
    ...new globalThis.Set(sets.map((set) => getUserImageKey(set.user.email))),
  ];

  const images = await Promise.all(
    uniqueKeys.map((key) => minioService.getUserImage(key))
  );

  const pictureCache = uniqueKeys.reduce((acc, key, index) => {
    acc[key] = images[index];
    return acc;
  }, {});

  return sets.map((set) => {
    const emailKey = getUserImageKey(set.user.email);
    const userImage = pictureCache[emailKey];

    return {
      _id: set._id,
      name: set.name,
      image: set.image,
      username: set.user.username,
      reviewDate: set.reviewDate
        ? set.reviewDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        : null,
      userImage,
    };
  });
}
