const router = require('express').Router();

const userRouter = require('./loginSignup/customer/customer');
router.use(userRouter);
router.use('/sessions', require('./Sessions/index'));
router.use('/themes', require('./server'));
router.use('/library', require('./library/routes/index'));
router.use(
  '/libraryItems/recorded',
  require('./Sessions/LibraryItems/recorded')
);

router.use('/shorturl', require('./urlShorten'));
router.use('/libraryItems', require('./Sessions/LibraryItems'));

router.use('/trainer', require('./Trainer'));
router.use('/invite/trainer', require('./inviteTrainer'));
router.use('/stats', require('./stats'));
router.use('/certificates', require('./certificates/server'));
router.use('/blog', require('./blog'));
router.use('/communication', require('./communication'));
router.use('/settings', require('./settings'));
router.use('/affliates', require('./affliates'));
router.use('/dashboard', require('./dashboard'));
router.use('/monetization', require('./monetization'));
router.use('/stats/communication', require('./stats/communication'));

module.exports = router;
