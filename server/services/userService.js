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

async function generateToken(user) {
  const accessPayload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  const accessToken = await jwt.sign(accessPayload, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const accessDecoded = await jwt.verify(accessToken, process.env.JWT_SECRET);

  const refreshToken = await jwt.sign(
    { accessExpiry: accessDecoded.exp },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  await User.findByIdAndUpdate(user._id, { refreshToken });

  const result = {
    ...accessPayload,
    accessToken,
    refreshToken,
  };

  return result;
}

exports.logout = async (refreshToken) => {
  const user = await User.findOne({ refreshToken });

  if (!user) {
    throw new Error('Invalid refresh token!');
  }

  user.refreshToken = undefined;
  await user.save();

  return;
};
