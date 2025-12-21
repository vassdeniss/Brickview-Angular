const User = require('../models/User');
const jwt = require('../lib/jwt');
const bcrypt = require('bcrypt');
const minioService = require('./minioService');

const getUserImageKey = (email) => email.replace(/[.@]/g, '');

const base64ImageToBuffer = (dataUrl) => {
  if (!dataUrl) return null;
  const base64 = dataUrl.replace(/^data:image\/(\w+);base64,/, '');
  return Buffer.from(base64, 'base64');
};

const toPublicUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  sets: (user.sets || []).map((set) => ({
    ...(set.toObject ? set.toObject() : set),
    review: Boolean(set.review),
  })),
});

const createError = (enMsg, bgMsg, language, statusCode) => {
  const error = new Error(language === 'en' ? enMsg : bgMsg);
  error.statusCode = statusCode;
  return error;
};

exports.register = async (userData) => {
  const user = await User.create(userData);
  const token = await generateToken(user);

  if (userData.image) {
    const file = base64ImageToBuffer(userData.image);
    await minioService.saveUserImage(getUserImageKey(user.email), file);
  }

  return {
    tokens: token,
    user: toPublicUser(user),
  };
};

exports.login = async ({ username, password }, language) => {
  username = username.toLowerCase();
  const user = await User.findOne({
    normalizedUsername: username,
  }).populate('sets');

  const dummyHash = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8r3u4UqD9pQnq0V2mQmTt2cWn6o3uS';
  const hashToCheck = user ? user.password : dummyHash;
  const isValid = await bcrypt.compare(password, hashToCheck);

  if (!user || !isValid) {
    throw createError(
      'Invalid username or password!',
      'Невалидно потребителско име или парола!',
      language, 401);
  }

  const result = await generateToken(user);
  const image = await minioService.getUserImage(getUserImageKey(user.email));

  return {
    tokens: result,
    user: toPublicUser(user),
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

  return {
    accessToken,
    refreshToken,
  };
}

exports.validateRefreshToken = async (refreshToken) => {
  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw createError('Invalid refresh token!', 'Невалиден refresh token!', 'en', 401);
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

exports.editData = async (
  { username, profilePicture, deleteProfilePicture },
  refreshToken
) => {
  const user = await User.findOne({ refreshToken }).populate('sets');
  if (!user) throw createError('User not found!', 'Потребителят не е намерен!', 'en', 404);
  user.username = username;
  user.normalizedUsername = username.toLowerCase();

  let image;
  const userKey = getUserImageKey(user.email);
  if (deleteProfilePicture) {
    await minioService.deleteImage(userKey, '');
    image = undefined;
  } else if (profilePicture) {
    const file = base64ImageToBuffer(profilePicture);
    await minioService.saveUserImage(userKey, file);
    image = profilePicture;
  } else {
    image = undefined;
  }

  await user.save();
  return {
    user: toPublicUser(user),
    image,
  };
};
