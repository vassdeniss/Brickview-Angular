const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required!'],
    minLength: [4, 'Username must be at least 4 characters long!'],
    lowercase: true,
    validate: [
      {
        validator: async function (username) {
          username = username.toLowerCase();
          const user = await this.constructor.findOne({ username });

          if (!user) {
            return true;
          }

          if (this.id === user.id) {
            return true;
          }

          return false;
        },
        message: 'The username is taken!',
      },
    ],
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: [true, 'Email already exists!'],
    trim: true,
    lowercase: true,
    validate: [
      {
        validator: function (email) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
        },
        message: 'Please enter a valid email address!',
      },
      {
        validator: async function (email) {
          const user = await this.constructor.findOne({
            email: email.toLowerCase(),
          });

          if (!user) {
            return true;
          }

          if (this.id === user.id) {
            return true;
          }

          return false;
        },
        message: 'The email address is already in use!',
      },
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    minLength: [8, 'Password must be at least 8 characters long!'],
  },
  refreshToken: String,
  sets: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Set',
    },
  ],
});

userSchema.virtual('repeatPassword').set(function (value) {
  if (!value) {
    this.invalidate('repeatPassword', 'Repeat password is required!');
  }

  if (value !== this.password) {
    this.invalidate('repeatPassword', 'Password mismatch!');
  }
});

userSchema.post('validate', async function (doc) {
  /* istanbul ignore next  */
  if (doc.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
