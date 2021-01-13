const express = require('express');
const router = require('express').Router();
const path = require('path');
const { db } = require('../../common/db/sql');
const auth = require('../middleware/deepakAuth');
const Template = require('./schema2');

router.use(
  express.static(path.join(__dirname, '/Backend/Tutor/certificates/public'))
);

router.use('/', express.static(path.join(__dirname, '/public')));

router.get('/findAll', auth, async (req, res) => {
  try {
    const result = await Template.findAll(
      {
        where: { customer_id: req.user.customer_id },
        attributes: ['image_url', 'certificate_id', 'name'],
      },
      { type: db.QueryTypes.SELECT }
    );
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'Failed to fetch certificates',
      });
    return res.status(200).json({
      success: 1,
      certificates: result,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: 0,
      error: 'Could not fetch certificates',
      errorReturned: JSON.stringify(e),
    });
  }
});
router.use('/api', auth, require('./routes/index').route);

module.exports = router;
