const router = require('express').Router();

const userController = require('./controllers/userController');
const setController = require('./controllers/setController');

router.use('/users', userController);
router.use('/sets', setController);

module.exports = router;
