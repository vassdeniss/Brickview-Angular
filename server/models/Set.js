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
  isReviewed: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Set = mongoose.model('Set', setSchema);

module.exports = Set;
