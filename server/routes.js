const router = require('express').Router();

const setController = require('./controllers/setController');

router.use('/sets', setController);

module.exports = router;
