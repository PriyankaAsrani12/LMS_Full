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
      `SELECT DISTINCT COUNT(student_id) as enrollments FROM student_purchases WHERE customer_id=${req.user.customer_id}`,
      { type: db.QueryTypes.SELECT }
    );

    const d = new Date();
    const prevMonth = d.getMonth() - 1;
    console.log(d, d.getMonth(), prevMonth);

    const last7daysSql = `SELECT  DATE(createdAt) as  Date, COUNT(customer_id) as  totalCOunt
    FROM    customer_tables
    WHERE  createdAt >= date_sub(curdate(), interval 7 day)
    GROUP   BY  DATE(createdAt)`;

    const last7days = await db.query(last7daysSql, {
      type: db.QueryTypes.SELECT,
    });

    const weekwiseSql = `SELECT WEEK(createdAt) AS weekNo,COUNT(customer_id) as totalCount
    FROM customer_tables
    WHERE createdAt >= (NOW() - INTERVAL 1 MONTH)
    GROUP BY weekNo `;

    const weekwiseData = await db.query(weekwiseSql, {
      type: db.QueryTypes.SELECT,
    });

    const monthWiseSql = `SELECT YEAR(createdAt) AS y, MONTH(createdAt) AS m, COUNT(customer_id) as totalCount
    FROM customer_tables
    wHERE createdAt >= (NOW()- INTERVAL 3 MONTH)
    GROUP BY y, m`;

    const monthWiseData = await db.query(monthWiseSql, {
      type: db.QueryTypes.SELECT,
    });

    const finalSql = `
    SELECT  DATE(createdAt) as  Date, COUNT(customer_id) as  totalCount FROM  customer_tables WHERE  createdAt >= date_sub(curdate(), interval 7 day) GROUP   BY  DATE(createdAt);
    SELECT WEEK(createdAt) AS weekNo,COUNT(customer_id) as totalCount1
    FROM customer_tables
    WHERE createdAt >= (NOW() - INTERVAL 1 MONTH)
    GROUP BY weekNo;
    SELECT YEAR(createdAt) AS y, MONTH(createdAt) AS m, COUNT(customer_id) as totalCount2
    FROM customer_tables
    wHERE createdAt >= (NOW()- INTERVAL 3 MONTH)
    GROUP BY y, m;
    `;

    const result9 = await db.query(finalSql, { type: db.QueryTypes.SELECT });

    return res.status(200).json({
      success: 1,
      enrollments: result2,
      totalCourses: result,
      last7days,
      weekwiseData,
      monthWiseData,
      result9,
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
