const User = require('../models/User');
const jwt = require('../lib/jwt');
const bcrypt = require('bcrypt');
const minioService = require('./minioService');

exports.register = async (userData) => {
  const user = await User.create(userData);
  const result = await generateToken(user);

  if (userData.image) {
    const base64String = userData.image;
    const base64Data = base64String.replace(/^data:image\/(\w+);base64,/, '');
    const file = Buffer.from(base64Data, 'base64');
    minioService.saveUserImage(user.email.replace(/[.@]/g, ''), file);
  }

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
  const image = await minioService.getUserImage(
    user.email.replace(/[.@]/g, '')
  );

  return {
    ...result,
    image,
  };
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
  if (!user) {
    return;
  }

  user.refreshToken = '';
  return await user.save();
};

exports.getLoggedInUser = async (refreshToken) => {
  const user = await User.findOne({ refreshToken });
  const image = await minioService.getUserImage(
    user.email.replace(/[.@]/g, '')
  );

  return {
    username: user.username,
    email: user.email,
    sets: user.sets,
    image,
  };
};

exports.editData = async (
  { username, profilePicture, deleteProfilePicture },
  refreshToken
) => {
  const user = await User.findOne({ refreshToken });
  user.username = username;

  if (deleteProfilePicture) {
    minioService.deleteImage(user.email.replace(/[.@]/g, ''));
  } else {
    const base64Data = profilePicture.replace(/^data:image\/(\w+);base64,/, '');
    const file = Buffer.from(base64Data, 'base64');
    minioService.saveUserImage(user.email.replace(/[.@]/g, ''), file);
  }

  await user.save();
};
