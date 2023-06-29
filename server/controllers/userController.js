const router = require('express').Router();

const { mustBeAuth } = require('../middlewares/auth');
const userService = require('../services/userService');

router.post('/register', async (req, res) => {
  try {
    const result = await userService.register(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.get('/logout', mustBeAuth, async (req, res) => {
  try {
    await userService.logout(res.user.refreshToken);
    res.status(200).end();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
