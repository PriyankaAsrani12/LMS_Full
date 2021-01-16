const router = require('express').Router();
const CouponModel = require('./CouponModel');
const verifyToken = require('../middlewares/verifyToken');

router.post('/', verifyToken, async (req, res) => {
  try {
    const code = req.body.values;
    const result = await CouponModel.findOne({
      where: { coupon_code: code },
      attributes: ['coupon_code', 'coupon_code_value'],
    });
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'Unable to find coupon',
      });
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to find coupon',
    });
  }
});

module.exports = router;
