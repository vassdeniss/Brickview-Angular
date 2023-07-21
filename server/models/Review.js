const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  buildExperience: {
    type: String,
    minLength: [50, 'Build experience must be at least 50 characters long!'],
    maxLength: [
      550,
      'Build experience cannot be longer than 550 characters long!',
    ],
  },
  design: {
    type: String,
    maxLength: [550, 'Design cannot be longer than 550 characters long!'],
  },
  minifigures: {
    type: String,
    maxLength: [550, 'Minifigures cannot be longer than 550 characters long!'],
  },
  value: {
    type: String,
    maxLength: [550, 'Value cannot be longer than 550 characters long!'],
  },
  other: {
    type: String,
    maxLength: [550, 'Other cannot be longer than 550 characters long!'],
  },
  verdict: {
    type: String,
    maxLength: [550, 'Verdict cannot be longer than 550 characters long!'],
  },
  set: {
    type: mongoose.Types.ObjectId,
    ref: 'Set',
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
