const User = require('../models/User');
const jwt = require('../lib/jwt');
const bcrypt = require('bcrypt');

exports.register = async (userData) => {
  const user = await User.create(userData);
  const result = await generateToken(user);
  return result;
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error('Invalid email or password!');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password!');
  }

  const result = await generateToken(user);
  return result;
};

exports.generateToken = (user) => generateToken(user);

async function generateToken(user) {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  const accessToken = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  user.refreshToken = refreshToken;
  await user.save();

  const result = {
    accessToken,
    refreshToken,
  };

  return result;
}

exports.validateRefreshToken = async (refreshToken) => {
  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new Error('Invalid refresh token!');
  }

  return user;
};

exports.logout = async (refreshToken) => {
  const user = await User.findOne({ refreshToken });
  user.refreshToken = '';
  return await user.save();
};

// exports.getCollection = async () => {
//   const id = 'idkWhereToGetIdFrom'; // TODO: figure out client side requests

//   const user = await User.findById(id).populate('sets');
//   if (!user) {
//     throw new Error('Invalid user ID!');
//   }

//   return user.sets;
// };
