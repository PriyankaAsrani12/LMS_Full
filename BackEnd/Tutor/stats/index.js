const router = require('express').Router();
const auth = require('../middleware/deepakAuth');
const { db } = require('../../common/db/sql');

router.get('/', auth, async (req, res) => {
  try {
    const sql = `SELECT session_name,session_registration,session_fee,session_type from session_tables WHERE customer_id=${req.user.customer_id} `;
    const result = await db.query(sql, { type: db.QueryTypes.SELECT });
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'Unable to fetch data',
      });
    const totalLibraryItems = await db.query(
      `SELECT COUNT(item_id) as totalLibraryItems from library_items where customer_id=${req.user.customer_id}`,
      { type: db.QueryTypes.SELECT }
    );
    const studentsEnrolled = await db.query(
      `SELECT DISTINCT count(student_id) as students from student_purchases where customer_id=${req.user.customer_id}`,
      { type: db.QueryTypes.SELECT }
    );
    return res.status(200).json({
      success: 1,
      result,
      totalLibraryItems: totalLibraryItems[0].totalLibraryItems,
      totalStudents: studentsEnrolled[0].students,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'Could not fetch data',
      errorReturned: JSON.stringify(err),
    });
  }
});

router.get('/students', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT student_first_name,student_last_name,student_email,student_phone_number from student_tables WHERE customer_id=${req.user.customer_id}`,
      { type: db.QueryTypes.SELECT }
    );

    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'Unable to fetch data',
      });
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'Could not fetch data',
      errorReturned: JSON.stringify(err),
    });
  }
});

module.exports = router;
