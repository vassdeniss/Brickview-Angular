const axios = require('axios');
const Set = require('../models/Set');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const minioService = require('../services/minioService');

const host = 'https://rebrickable.com';

exports.getAllWithReview = async () => {
  const sets = await Set.find({ review: { $ne: null } })
    .select('name image')
    .populate('user', 'username email');

  return Promise.all(
    sets.map(async (set) => {
      return {
        _id: set._id,
        name: set.name,
        image: set.image,
        username: set.user.username,
        userImage: await minioService.getUserImage(
          set.user.email.replace(/[.@]/g, '')
        ),
      };
    })
  );
};

// exports.getLoggedInUserCollection = async (refreshToken) => {
//   const user = await User.findOne({ refreshToken })
//     .populate('sets')
//     .select('sets');

//   return user.sets;
// };

exports.getUserCollection = async (username) => {
  username = username.toLowerCase();
  const user = await User.findOne({ normalizedUsername: username }).populate(
    'sets'
  );

  if (!user) {
    throw new Error('User not found!');
  }

  return {
    user: {
      image: await minioService.getUserImage(user.email.replace(/[.@]/g, '')),
      username: user.username,
    },
    sets: user.sets,
  };
};

exports.addSet = async (setId, refreshToken) => {
  const foundSet = await axios
    .get(`${host}/api/v3/lego/sets/${setId}-1/`, {
      headers: {
        Authorization: `key ${process.env.REBRICKABLE_API_KEY}`,
      },
    })
    .catch((err) => {
      if (err.response) {
        const error = new Error('Set not found!');
        error.statusCode = 404;
        throw error;
      }
    });

  const figs = await axios.get(
    `${host}/api/v3/lego/sets/${setId}-1/minifigs/`,
    {
      headers: {
        Authorization: `key ${process.env.REBRICKABLE_API_KEY}`,
      },
    }
  );

  const user = await User.findOne({ refreshToken }).populate('sets');
  if (user.sets.find((set) => foundSet.data.set_num.includes(set.setNum))) {
    const error = new Error('Set already exists in collection!');
    error.statusCode = 409;
    throw error;
  }

  const setData = {
    setNum: foundSet.data.set_num,
    name: foundSet.data.name,
    year: foundSet.data.year,
    parts: foundSet.data.num_parts,
    image: foundSet.data.set_img_url,
    minifigCount: figs.data.count,
    minifigs: [],
    user: user._id,
  };

  for (const fig of figs.data.results) {
    setData.minifigs.push({
      name: fig.set_name,
      quantity: fig.quantity,
      image: fig.set_img_url,
    });
  }

  const set = await Set.create(setData);
  user.sets.push(set._id);
  await user.save();

  let sets = [...user.sets];
  const userSetsIndex = sets.findIndex((userSet) =>
    userSet._id.equals(set._id)
  );

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
      sets,
    },
  };
};

exports.deleteSet = async (setId, token) => {
  const payload = jwt.decode(token);
  const email = payload.email.replace(/[.@]/g, '');
  const id = payload._id;

  const set = await Set.findById(setId).populate('user');
  if (!set) {
    const error = new Error('Set not found!');
    error.statusCode = 404;
    throw error;
  }

  if (set.user._id.toString() !== id) {
    const error = new Error('You are not authorized to delete this set!');
    error.statusCode = 403;
    throw error;
  }

  if (set.review) {
    await minioService.deleteReviewImages(email, set.setNum);
  }

  set.user.sets.splice(set.user.sets.indexOf(set._id), 1);
  await set.user.save();
  set.user.populate('sets');

  const updatedUser = {
    user: {
      _id: set.user._id,
      username: set.user.username,
      email: set.user.email,
      sets: set.user.sets,
    },
  };
  await set.deleteOne();
  return updatedUser;
};
