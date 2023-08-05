const Set = require('../models/Set');
const jwt = require('jsonwebtoken');
const minioService = require('../services/minioService');

exports.addReview = async (data, token) => {
  const payload = jwt.decode(token);
  const email = payload.email.replace(/[.@]/g, '');

  const buffers = [];
  for (const file of data.setImages) {
    const base64Data = file.replace(/^data:image\/(\w+);base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    buffers.push(buffer);
  }

  const set = await Set.findById(data._id).select('setNum');
  await minioService.saveReview(email, set.setNum, buffers);
  set.review = data.content;
  return set.save();
};

exports.getReview = async (setId) => {
  const set = await Set.findById(setId).populate('user');
  if (!set.review) {
    throw new Error('Review not found!');
  }

  const images = await minioService.getReviewImages(
    set.user.email.replace(/[.@]/g, ''),
    set.setNum
  );

  return {
    _id: set._id,
    setName: set.name,
    setImage: set.image,
    setNumber: set.setNum,
    setParts: set.parts,
    setYear: set.year,
    setMinifigCount: set.minifigCount,
    setImages: images,
    setMinifigures: set.minifigs,
    userUsername: set.user.username,
    content: set.review,
  };
};

exports.deleteReview = async (setId, token) => {
  const payload = jwt.decode(token);
  const email = payload.email.replace(/[.@]/g, '');
  const id = payload._id;

  const set = await Set.findById(setId).populate('user');
  if (!set.review) {
    throw new Error('Review not found!');
  }

  if (set.user._id.toString() !== id) {
    throw new Error('You are not authorized to delete this review!');
  }

  await minioService.deleteReviewImages(email, set.setNum);
  set.review = null;
  await set.save();
};
