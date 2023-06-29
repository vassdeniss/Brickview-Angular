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

  console.log(password, user.password);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password!');
  }

  const result = await generateToken(user);
  return result;
};

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

  await User.findByIdAndUpdate(user._id, { refreshToken });

  const result = {
    ...payload,
    accessToken,
    refreshToken,
  };

  return result;
}
