const Review = require('../models/Review');
const Set = require('../models/Set');
const jwt = require('jsonwebtoken');
const minioService = require('../services/minioService');

exports.addReview = async (data, token) => {
  const payload = jwt.decode(token);
  const email = payload.email.replace(/[.@]/g, '');
  const id = payload._id;

  const buffers = [];
  for (const file of data.imageSources) {
    const base64Data = file.replace(/^data:image\/(\w+);base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    buffers.push(buffer);
  }

  const setNum = await getSetNumAndMarkReviewed(data.set);
  await minioService.saveReview(email, setNum, buffers);

  return Review.create({
    buildExperience: data.buildExperience,
    design: data.design,
    minifigures: data.minifigures,
    value: data.value,
    other: data.other,
    verdict: data.verdict,
    set: data.set,
    user: id,
  });
};

exports.getReview = async (setId) => {
  const review = await Review.find({ set: setId })
    .populate('user')
    .populate('set');

  const images = await minioService.getReviewImages(
    review[0].user.email.replace(/[.@]/g, ''),
    review[0].set.setNum
  );

  return {
    _id: review[0]._id,
    buildExperience: review[0].buildExperience,
    design: review[0].design,
    minifigures: review[0].minifigures,
    value: review[0].value,
    other: review[0].other,
    verdict: review[0].verdict,
    set: review[0].set,
    user: review[0].user,
    imageSources: images,
  };
};

async function getSetNumAndMarkReviewed(setId) {
  const set = await Set.findById(setId).select('setNum');
  set.isReviewed = true;
  await set.save();
  return set.setNum;
}
