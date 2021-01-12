const router = require('express').Router();

router.use('/auth', require('./loginSignUp'));
router.use('/sessions', require('./sessions'));
router.use('/blog', require('./blog'));
router.use('/courses', require('./courses'));
router.use('/referal', require('./referalLink'));
router.use('/mycourses', require('./mycourses'));

module.exports = router;
