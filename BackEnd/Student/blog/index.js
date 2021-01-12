const router = require('express').Router();
const Blog = require('./model');
const verifyToken = require('../middlewares/verifyToken');

router.post('/', verifyToken, async (req, res) => {
  try {
    console.log(req.files, JSON.parse(req.body.values));

    const values = JSON.parse(req.body.values);
    values.blog_thumbnail = 'https://www.google.com';
    values.student_id = req.user.student_id;
    values.customer_id = 2;
    const result = await Blog.create(values);
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'could not save blog',
      });
    return res.status(200).json({
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'could not post blog',
      errorReturned: JSON.stringify(err),
    });
  }
});

module.exports = router;
