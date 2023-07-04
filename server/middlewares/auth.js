const jwt = require('../lib/jwt');

exports.mustBeAuth = (req, res, next) => {
  const token = req.header('X-Autherization');

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(400).json({
        meesage: 'You are not authorized!',
      });
    }
  } else {
    next();
  }
};
