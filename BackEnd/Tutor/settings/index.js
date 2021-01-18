const router = require('express').Router();
const auth = require('../middleware/deepakAuth');
const { User } = require('../loginSignup/customer/models');

router.get('/toggle', auth, async (req, res) => {
  try {
    const result = await User.findOne({
      where: { customer_id: req.user.customer_id },
      attributes: [
        'customer_blogs',
        'customer_affiliate',
        'customer_affiliate_monitary_benifits',
        'customer_currency_name',
        'customer_currency_rate',
        'customer_affiliate_fixed_rate',
        'customer_affiliate_did_changes',
        'customer_affiliate_range_cost_min',
        'customer_affiliate_range_cost_max',
        'customer_affiliate_range_rate',
      ],
    });
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to get changes',
    });
  }
});

router.post('/toggle', auth, async (req, res) => {
  try {
    const { field, value } = req.body.values;
    if (field == 'customer_affiliate_fixed_rate')
      await User.update(
        {
          [field]: value,
          customer_affiliate_type: 'fixed',
          customer_affiliate_did_changes: 1,
        },
        { where: { customer_id: req.user.customer_id } }
      );
    else
      await User.update(
        { [field]: value },
        { where: { customer_id: req.user.customer_id } }
      );
    return res.status(200).json({
      success: 1,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to update changes',
    });
  }
});

router.post('/currency', auth, async (req, res) => {
  try {
    const { customer_currency_name, customer_currency_rate } = req.body.values;
    const result = await User.update(
      { customer_currency_name, customer_currency_rate },
      { where: { customer_id: req.user.customer_id } }
    );
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to save currency details',
    });
  }
});

router.post('/setranges', auth, async (req, res) => {
  try {
    const { minRange, maxRange, rateRange } = req.body.values;
    const result = await User.update(
      {
        customer_affiliate_range_cost_min: minRange,
        customer_affiliate_range_cost_max: maxRange,
        customer_affiliate_range_rate: rateRange,
        customer_affiliate_type: 'ranges',
        customer_affiliate_did_changes: 1,
      },
      { where: { customer_id: req.user.customer_id } }
    );
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to Update data',
    });
  }
});

module.exports = router;
