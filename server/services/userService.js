const User = require('../models/User');
const jwt = require('../lib/jwt');
const bcrypt = require('bcrypt');

exports.register = async (userData) => {
  const user = await User.create(userData);
  return generateToken(user);
};

exports.login = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('Invalid username or password!');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid username or password!');
  }

  return generateToken(user);
};

async function generateToken(user) {
  const payload = {
    _id: user._id,
    username: user.username,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_TOKEN, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_TOKEN, {
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
