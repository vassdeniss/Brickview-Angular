const router = require('express').Router();

const userController = require('./controllers/userController');
const setController = require('./controllers/setController');
const reviewController = require('./controllers/reviewController');

router.use('/users', userController);
router.use('/sets', setController);
router.use('/reviews', reviewController);

module.exports = router;
