const router = require('express').Router();
const auth = require('../middleware/deepakAuth');
const { db } = require('../../common/db/sql');

router.get('/', auth, async (req, res) => {
  try {
    const sql = `SELECT blog_writer_name,blog_title   FROM blog_tables WHERE customer_id=${req.user.customer_id}`;
    const sql2 = `SELECT blog_writer_name, count(blog_writer_name) as total_blogs FROM blog_tables WHERE customer_id=${req.user.customer_id}`;

    const result1 = await db.query(sql, { type: db.QueryTypes.SELECT });

    const result2 = await db.query(sql2, { type: db.QueryTypes.SELECT });

    return res.status(200).json({
      success: 1,
      result1,
      result2,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to fetch blogs',
    });
  }
});

module.exports = router;
