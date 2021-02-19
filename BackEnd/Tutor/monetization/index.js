const router = require('express').Router();
const auth = require('../middleware/deepakAuth');
const { db } = require('../../common/db/sql');
require('../../Student/cart/RazorpayModel');

router.get('/', auth, async (req, res) => {
  try {
    const sql = `SELECT 
        payment_id,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_amount,
        razorpay_created_at as date ,
        razorpay_updated_at as time ,
        razorpay_status,
        razorpay_email,
        razorpay_contact
        FROM payment_data 
        WHERE customer_id=${req.user.customer_id}
        `;

    const sql2 = `SELECT SUM(affiliate_rewards_given) as total_rewards_given FROM affiliate_tables WHERE customer_id=${req.user.customer_id} `;
    const sql3 = `SELECT COUNT(session_id) as total_courses FROM session_tables WHERE customer_id=${req.user.customer_id}`;
    const result = await db.query(sql, { type: db.QueryTypes.SELECT });
    const result2 = await db.query(sql2, { type: db.QueryTypes.SELECT });
    const result3 = await db.query(sql3, { type: db.QueryTypes.SELECT });
    console.log(result2[0].total_rewards_given);
    return res.status(200).json({
      success: 1,
      result,
      total_rewards_given: result2[0].total_rewards_given,
      total_courses: result3[0].total_courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Umable to fetch data',
      errorReturned: JSON.stringify(error),
    });
  }
});

module.exports = router;
