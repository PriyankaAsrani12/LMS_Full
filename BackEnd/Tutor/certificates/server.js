const express = require('express');
const router = require('express').Router();
const path = require('path');
const { db } = require('../../common/db/sql');
const auth = require('../middleware/deepakAuth');
const Template = require('./schema2');

router.use('/', express.static(path.join(__dirname, '/public')));
router.use('/edit/:id', express.static(path.join(__dirname, '/edit')));

// router.get('/edit/:id', auth, async (req, res) =>
//   res.sendFile(path.join(__dirname, '/edit.html'))
// );

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

router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        success: 0,
        error: 'Certificate id not provided',
      });
    const result = await Template.destroy({
      where: {
        certificate_id: req.params.id,
      },
    });
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'failed to delete template',
      });
    return res.status(200).json({
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: 0,
      error: 'Unable to delete template',
      errorReturned: JSON.stringify(err),
    });
  }
});
router.use('/api', auth, require('./routes/index').route);

module.exports = router;
