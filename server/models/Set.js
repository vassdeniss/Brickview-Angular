const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  setNum: String,
  name: String,
  year: Number,
  parts: Number,
  image: String,
  minifigCount: Number,
  minifigs: [
    {
      name: String,
      quantity: Number,
      image: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  review: {
    type: String,
    minLength: [50, 'Review must be at least 50 characters long!'],
    maxLength: [5000, 'Review cannot exceed 5000 characters!'],
  },
  reviewDate: Date,
});

const Set = mongoose.model('Set', setSchema);

module.exports = Set;
