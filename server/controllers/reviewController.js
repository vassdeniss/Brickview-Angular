const router = require('express').Router();
const { mustBeAuth } = require('../middlewares/auth');
const reviewService = require('../services/reviewService');

router.post('/create', mustBeAuth, async (req, res) => {
  try {
    await reviewService.addReview(req.body, req.header('X-Refresh'));
    res.status(204).end();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
