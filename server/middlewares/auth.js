const jwt = require('../lib/jwt');
const userService = require('../services/userService');

exports.mustBeAuth = async (req, res, next) => {
  const token = req.header('X-Authorization');

  try {
    if (!token) {
      throw new Error('You are not authorized!');
    }

    try {
      await jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name !== 'TokenExpiredError') {
        throw err;
      }

      const refreshToken = req.header('X-Refresh');
      if (!refreshToken) {
        throw new Error('Invalid refresh token!');
      }

      const user = await userService.validateRefreshToken(refreshToken);

      const newTokens = await userService.generateToken(user);
      res.set('X-Refresh', newTokens.refreshToken);
      res.set('X-Authorization', newTokens.accessToken);
      res.set('access-control-expose-headers', [
        'X-Authorization',
        'X-Refresh',
      ]);
    }

    next();
  } catch (err) {
    res.status(401).json({
      message: err.message || 'You are not authorized!',
    });
  }
};
