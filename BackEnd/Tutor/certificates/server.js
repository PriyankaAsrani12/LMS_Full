const express = require('express');
const router = require('express').Router();
const path = require('path');
router.use(
  express.static(path.join(__dirname, '/Backend/Tutor/certificates/public'))
);

router.use('/', express.static(path.join(__dirname, '/public')));
router.use('/api', require('./routes/index').route);

module.exports = router;
