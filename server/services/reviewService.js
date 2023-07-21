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

async function getSetNumAndMarkReviewed(setId) {
  const set = await Set.findById(setId).select('setNum');
  set.isReviewed = true;
  await set.save();
  return set.setNum;
}
