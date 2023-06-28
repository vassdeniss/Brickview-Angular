const router = require('express').Router();

const setService = require('../services/setService');

router.get('/:setId', async (req, res) => {
  try {
    const set = await setService.getWithMinifigs(req.params.setId);
    res.json(set);
  } catch (err) {
    res.status(404).send('Set not found!');
  }
});

module.exports = router;
