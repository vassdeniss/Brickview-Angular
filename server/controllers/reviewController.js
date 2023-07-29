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

router.get('/get/:id', async (req, res) => {
  try {
    const review = await reviewService.getReview(req.params.id);
    res.status(200).json(review);
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id, req.header('X-Refresh'));
    res.status(204).end();
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
});

module.exports = router;
