const router = require('express').Router();

const rootController = require('./controllers/rootController');
const userController = require('./controllers/userController');
const setController = require('./controllers/setController');
const reviewController = require('./controllers/reviewController');

router.use('/', rootController);
router.use('/users', userController);
router.use('/sets', setController);
router.use('/reviews', reviewController);

module.exports = router;
