const User = require('../models/User');
const jwt = require('../lib/jwt');
const bcrypt = require('bcrypt');

exports.register = async (userData) => {
  const user = await User.create(userData);
  return generateToken(user);
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password!');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password!');
  }

  return generateToken(user);
};

async function generateToken(user) {
  const payload = {
    _id: user._id,
    username: user.username,
  };

  const accessToken = await jwt.sign(payload, process.env.JWT_TOKEN, {
    expiresIn: '15m',
  });
  const refreshToken = await jwt.sign(payload, process.env.JWT_TOKEN, {
    expiresIn: '7d',
  });

  user.refreshToken = refreshToken;
  await user.save();

  const result = {
    ...payload,
    accessToken,
    refreshToken,
  };

  return result;
}
