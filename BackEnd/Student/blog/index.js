const router = require('express').Router();
const Blog = require('./model');
const verifyToken = require('../middlewares/verifyToken');
const { db } = require('../../common/db/sql');
const webp = require('webp-converter');

router.get('/', verifyToken, async (req, res) => {
  try {
    const customer = await db.query(
      `SELECT customer_id FROM student_tables WHERE student_id=${req.user.student_id}`,
      { type: db.QueryTypes.SELECT }
    );

    const customer_id = customer[0].customer_id;

    const isEnabled = await db.query(
      `SELECT customer_blogs FROM customer_tables WHERE customer_id=${customer_id}`,
      { type: db.QueryTypes.SELECT }
    );

    if (!isEnabled[0].customer_blogs)
      return res.status(200).json({
        success: 0,
        isEnabled,
      });

    const sql = `SELECT 
    blog_id,
    blog_writer_email,
    blog_title
    FROM blog_tables
    WHERE student_id=${req.user.student_id}
    `;
    const result = await db.query(sql, { type: db.QueryTypes.SELECT });
    return res.status(200).json({
      success: 1,
      result,
      isEnabled: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Could not fetch blogs',
      errorReturned: error,
    });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    console.log(req.files, JSON.parse(req.body.values));

    const customer = await db.query(
      `SELECT customer_id FROM student_tables WHERE student_id=${req.user.student_id}`,
      { type: db.QueryTypes.SELECT }
    );
    if (req.files) {
      const file = req.files.blog_thumbnail;
      file.mv(`${process.env.FILE_UPLOAD_PATH_CLIENT}${file.name}`, (err) => {
        if (err)
          return res.status(500).json({
            success: 0,
            error: 'unable to upload thumbnail',
            errorReturned: JSON.stringify(err),
          });
        webp
          .cwebp(
            `${process.env.FILE_UPLOAD_PATH_CLIENT}${file.name}`,
            `${process.env.FILE_UPLOAD_PATH_CLIENT}${file.name.substr(
              0,
              file.name.lastIndexOf('.')
            )}.webp`,
            '-q 80'
          )
          .then((response) => console.log(response))
          .catch((err) => console.log(err));
        console.log('blog_thumbnail uploaded');
      });
    }

    const values = JSON.parse(req.body.values);
    values.blog_thumbnail = 'https://www.google.com';
    values.student_id = req.user.student_id;
    values.customer_id = customer.customer_id;

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

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await Blog.destroy({ where: { blog_id: req.params.id } });
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(errror);
    return res.status(400).json({
      success: 0,
      error: 'Unable to delete blog',
      errorReturned: JSON.stringify(error),
    });
  }
});

module.exports = router;
