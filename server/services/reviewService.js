const Set = require('../models/Set');
const User = require('../models/User');
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
  set.reviewDate = Date.now();
  set.videoIds = getVideoIds(data.setVideoIds);
  await set.save();

  const user = await User.findOne({ refreshToken: token }).populate('sets');
  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      sets: user.sets.map((set) => ({
        ...set.toObject(),
        review: Boolean(set.review),
      })),
    },
  };
};

exports.getReview = async (setId, language) => {
  const set = await Set.findById(setId).populate('user');
  if (!set.review) {
    throw new Error(
      language === 'en' ? 'Review not found!' : 'Мнението не беше намерено!'
    );
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
    setVideoIds: set.videoIds,
    setMinifigures: set.minifigs,
    userId: set.user._id,
    userUsername: set.user.username,
    content: set.review,
  };
};

exports.editReview = async (data, token, language) => {
  const payload = jwt.decode(token);
  const email = payload.email.replace(/[.@]/g, '');
  const id = payload._id;

  const buffers = [];
  for (const file of data.setImages) {
    const base64Data = file.replace(/^data:image\/(\w+);base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    buffers.push(buffer);
  }

  const set = await Set.findById(data._id)
    .select('review setNum videoIds')
    .populate('user');
  if (!set.review) {
    const error = new Error(
      language === 'en' ? 'Review not found!' : 'Мнението не беше намерено!'
    );
    error.statusCode = 404;
    throw error;
  }

  if (set.user._id.toString() !== id) {
    const error = new Error(
      language === 'en'
        ? 'You are not authorized to edit this review!'
        : 'Нямате права да редактирате това мнение!'
    );
    error.statusCode = 403;
    throw error;
  }

  set.videoIds = getVideoIds(data.setVideoIds);

  await minioService.deleteReviewImagesWithoutBucket(email, set.setNum);
  await minioService.saveReview(email, set.setNum, buffers);
  set.review = data.content;
  await set.save();

  const user = await User.findOne({ refreshToken: token }).populate('sets');
  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      sets: user.sets.map((set) => ({
        ...set.toObject(),
        review: Boolean(set.review),
      })),
    },
  };
};

exports.deleteReview = async (setId, token, language) => {
  const payload = jwt.decode(token);
  const email = payload.email.replace(/[.@]/g, '');
  const id = payload._id;

  const set = await Set.findById(setId).populate('user');
  if (!set.review) {
    const error = new Error(
      language === 'en' ? 'Review not found!' : 'Мнението не беше намерено!'
    );
    error.statusCode = 404;
    throw error;
  }

  if (set.user._id.toString() !== id) {
    const error = new Error(
      language === 'en'
        ? 'You are not authorized to delete this review!'
        : 'Нямате права да изтриете това мнение!'
    );
    error.statusCode = 403;
    throw error;
  }

  await minioService.deleteReviewImages(email, set.setNum);
  set.review = null;
  set.reviewDate = null;
  set.videoIds = [];
  await set.save();

  const user = await User.findOne({ refreshToken: token }).populate('sets');
  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      sets: user.sets.map((set) => ({
        ...set.toObject(),
        review: Boolean(set.review),
      })),
    },
  };
};

function getVideoIds(videoLinks) {
  if (videoLinks === '') {
    return [];
  }

  return videoLinks
    .split(',')
    .map((link) => link.trim())
    .reduce((acc, curr) => {
      const pattern =
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/gm;
      const regex = new RegExp(pattern);
      acc.push(regex.exec(curr)[6]);
      return acc;
    }, []);
}
