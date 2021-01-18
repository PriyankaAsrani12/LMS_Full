const router = require('express').Router();
const { User } = require('../loginSignup/customer/models');
const auth = require('../middleware/deepakAuth');
const { db } = require('../../common/db/sql');

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT COUNT(session_id) as totalCourses FROM session_tables WHERE customer_id=${req.user.customer_id}`,
      { type: db.QueryTypes.SELECT }
    );
    const result2 = await db.query(
      `SELECT COUNT(student_id) as enrollments FROM student_tables WHERE customer_id=${req.user.customer_id}`,
      { type: db.QueryTypes.SELECT }
    );

    return res.status(200).json({
      success: 1,
      enrollments: result2,
      totalCourses: result,
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
