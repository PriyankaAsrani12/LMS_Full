const { db } = require('../../common/db/sql');

const router = require('express').Router();
const auth = require('../middleware/deepakAuth');

router.get('/', auth, async (req, res) => {
  try {
    const sql = `SELECT 
        affiliate_name,
        course_name,
        COUNT(affiliate_brought_student_id) as no_of_enrollments  ,
        SUM(affiliate_rewards_given) as rewards_given ,
        SUM(affiliate_purchaed_amount) as revenue_generated 
        FROM  affiliate_tables
        WHERE customer_id=${req.user.customer_id}
        GROUP BY affiliate_name,course_name`;

    const sql2 = `SELECT  
            course_name,
            COUNT(affiliate_name) total_enrollments ,
            COUNT(affiliate_brought_student_name) enrollments_by_affiliate ,
            SUM(affiliate_purchaed_amount) as revenue_generated_by_affiliate ,
            SUM(affiliate_rewards_given) as rewards_given 
            FROM  affiliate_tables
            WHERE customer_id=${req.user.customer_id}
            GROUP BY course_name
            `;

    const result = await db.query(sql, { type: db.QueryTypes.SELECT });
    const result2 = await db.query(sql2, { type: db.QueryTypes.SELECT });

    return res.status(200).json({
      success: 1,
      result,
      result2,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to fetch data',
    });
  }
});

module.exports = router;
