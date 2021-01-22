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

    const GraphData = [];

    // student_tables week,month,day wise data taking registrations
    const first = [];
    const finalSql = `
    SELECT  DATE(createdAt) as  label, COUNT(student_id) as  totalCount FROM  student_tables WHERE  createdAt >= date_sub(curdate(), interval 6 day) GROUP   BY  DATE(createdAt);
    SELECT WEEK(createdAt) AS weekNo,COUNT(student_id) as totalCount1 FROM student_tables  WHERE createdAt >= (NOW() - INTERVAL 1 MONTH) GROUP BY weekNo;
    SELECT YEAR(createdAt) AS y, MONTH(createdAt) AS m, COUNT(student_id) as totalCount2 FROM student_tables wHERE createdAt >= (NOW()- INTERVAL 3 MONTH) GROUP BY y, m;
    `;
    const result9 = await db.query(finalSql, { type: db.QueryTypes.SELECT });

    const b = [];
    for (const [key, value] of Object.entries(result9[0])) b.push(value);

    const c = [];
    for (const [key, value] of Object.entries(result9[1])) c.push(value);

    const d = [];
    for (const [key, value] of Object.entries(result9[2])) d.push(value);

    first.push(b);
    first.push(c);
    first.push(d);

    GraphData.push(first);

    // student_purchases week,month,day wise data ...taking enrollments
    const second = [];
    const finalSql2 = `
     SELECT  DATE(createdAt) as  label, COUNT(student_id) as  totalCount FROM  student_purchases WHERE  createdAt >= date_sub(curdate(), interval 6 day) GROUP   BY  DATE(createdAt);
     SELECT DISTINCT COUNT(student_id) as totalCount1,WEEK(createdAt) AS weekNo FROM student_purchases  WHERE createdAt >= (NOW() - INTERVAL 1 MONTH) GROUP BY weekNo;
     SELECT YEAR(createdAt) AS y, MONTH(createdAt) AS m, COUNT(student_id) as totalCount2 FROM student_purchases wHERE createdAt >= (NOW()- INTERVAL 3 MONTH) GROUP BY y, m;
     `;
    const result10 = await db.query(finalSql2, { type: db.QueryTypes.SELECT });

    const b1 = [];
    for (const [key, value] of Object.entries(result10[0])) b1.push(value);

    const c1 = [];
    for (const [key, value] of Object.entries(result10[1])) c1.push(value);

    const d1 = [];
    for (const [key, value] of Object.entries(result10[2])) d1.push(value);

    second.push(b1);
    second.push(c1);
    second.push(d1);

    GraphData.push(second);

    // affiliate_tables week,month,day wise data...taking revenue
    const third = [];
    const finalSql3 = `
    SELECT  DATE(created_at) as  label, SUM(affiliate_rewards_given) as  totalCount FROM  affiliate_tables WHERE  created_at >= date_sub(curdate(), interval 6 day) GROUP   BY  DATE(created_at);
    SELECT  SUM(affiliate_rewards_given) as totalCount1,WEEK(created_at) AS weekNo FROM affiliate_tables  WHERE created_at >= (NOW() - INTERVAL 1 MONTH) GROUP BY weekNo;
    SELECT YEAR(created_at) AS y, MONTH(created_at) AS m, SUM(affiliate_rewards_given) as totalCount2 FROM affiliate_tables wHERE created_at >= (NOW()- INTERVAL 3 MONTH) GROUP BY y, m;
    `;
    const result11 = await db.query(finalSql3, { type: db.QueryTypes.SELECT });

    const b2 = [];
    for (const [key, value] of Object.entries(result11[0])) b2.push(value);

    const c2 = [];
    for (const [key, value] of Object.entries(result11[1])) c2.push(value);

    const d2 = [];
    for (const [key, value] of Object.entries(result11[2])) d2.push(value);

    third.push(b2);
    third.push(c2);
    third.push(d2);

    GraphData.push(third);

    return res.status(200).json({
      GraphData,
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
