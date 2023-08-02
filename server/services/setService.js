const axios = require('axios');
const Set = require('../models/Set');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { deleteReview } = require('./reviewService');
const Review = require('../models/Review');
const minioService = require('../services/minioService');

const host = 'https://rebrickable.com';

exports.getAllWithReview = async () => {
  const sets = await Set.find()
    .where('isReviewed')
    .equals(true)
    .select('name image')
    .populate('user', 'username email');

  const setsWithImages = await Promise.all(
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

  return setsWithImages;
};

exports.getLoggedInUserCollection = async (refreshToken) => {
  const user = await User.findOne({ refreshToken })
    .populate('sets')
    .select('sets');

  if (!user) {
    throw new Error('Invalid refresh token!');
  }

  return user.sets;
};

exports.addSet = async (setId, refreshToken) => {
  const foundSet = await axios.get(`${host}/api/v3/lego/sets/${setId}-1/`, {
    headers: {
      Authorization: `key ${process.env.REBRICKABLE_API_KEY}`,
    },
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
    throw new Error('Set already exists in collection!');
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
};

exports.deleteSet = async (setId, token) => {
  const payload = jwt.decode(token);
  const id = payload._id;

  const set = await Set.findById(setId).populate('user');
  if (!set) {
    throw new Error('Set not found!');
  }

  if (set.user._id.toString() !== id) {
    throw new Error('You are not authorized to delete this set!');
  }

  const review = await Review.findOne({ set: set._id }).select('_id');
  if (review) {
    await deleteReview(review._id.toString(), token);
  }

  set.user.sets.splice(set.user.sets.indexOf(set._id), 1);
  await set.user.save();

  await set.deleteOne();
};
