const router = require('express').Router();

router.use('/auth', require('./loginSignUp'));
router.use('/sessions', require('./sessions'));
router.use('/blog', require('./blog'));
router.use('/courses', require('./courses'));
router.use('/referal', require('./referalLink'));
router.use('/mycourses', require('./mycourses'));
router.use('/cart', require('./cart'));
router.use('/affiliates', require('./affiliate'));

module.exports = router;
