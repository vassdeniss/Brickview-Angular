const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required!'],
    minLength: [4, 'Username must be at least 4 characters long!'],
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    minLength: [8, 'Password must be at least 8 characters long!'],
  },
});

userSchema.virtual('repeatPassword').set(function (value) {
  if (!value) {
    this.invalidate('repeatPassword', 'Repeat password is required!');
  }

  if (value !== this.password) {
    this.invalidate('repeatPassword', 'Password mismatch!');
  }
});

userSchema.post('validate', async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
