const router = require('express').Router();
const mysql = require('mysql');
// const { db, Library } = require("./models");
const auth = require('../../middleware/deepakAuth');

//Connecting to database
const { db } = require('../../../common/db/sql');

// To fetch all the data related to that customer
//i.e. all material
router.get('/', auth, async (req, res) => {
  try {
    //Fetch User Specific Data
    let sql = `SELECT item_id, item_type,item_name,item_size,updatedAt FROM library_items WHERE  customer_id =${req.user.customer_id} `;

    let query = await db.query(sql);
    if (!query)
      return res.status(400).json({
        success: 0,
        error: 'unable to fetch data',
      });
    return res.status(200).json({
      success: 1,
      result: query[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

//To fetch all the data where type = video
router.get('/videos', auth, async (req, res) => {
  try {
    let sql = `SELECT item_id,item_type,item_name,item_size,updatedAt FROM library_items WHERE item_type='video' AND customer_id = ${req.user.customer_id} `;

    let query = await db.query(sql);
    if (!query)
      return res.status(400).json({
        success: 0,
        error: 'unable to fetch data',
      });
    return res.status(200).json({
      success: 1,
      result: query[0],
    });
  } catch (err) {
    console.error(err);
    res.json({
      error: err,
    });
  }
});

//To fetch all the data where type = recording
router.get('/recordings', auth, async (req, res) => {
  try {
    let sql = `SELECT item_id,item_type,item_name,item_size,updatedAt FROM library_items WHERE item_type='recording' AND customer_id = ${req.user.customer_id} `;

    let query = await db.query(sql);
    if (!query)
      return res.status(400).json({
        success: 0,
        error: 'unable to fetch data',
      });
    return res.status(200).json({
      success: 1,
      result: query[0],
    });
  } catch (err) {
    console.error(err);
    res.json({
      error: err,
    });
  }
});

//To fetch all the data where type = assignment
router.get('/assignments', auth, async (req, res) => {
  try {
    let sql = `SELECT item_id,item_type,item_name,item_size,updatedAt FROM library_items WHERE item_type='assignment' AND customer_id = ${req.user.customer_id} `;

    let query = await db.query(sql);
    if (!query)
      return res.status(400).json({
        success: 0,
        error: 'unable to fetch data',
      });
    return res.status(200).json({
      success: 1,
      result: query[0],
    });
  } catch (err) {
    console.error(err);
    res.json({
      error: err,
    });
  }
});

//To fetch all the data where type = quiz
router.get('/quizs', auth, async (req, res) => {
  try {
    let sql = `SELECT item_id,item_type,item_name,item_size,updatedAt FROM library_items WHERE item_type='quiz' AND customer_id = ${req.user.customer_id} `;

    let query = await db.query(sql);
    if (!query)
      return res.status(400).json({
        success: 0,
        error: 'unable to fetch data',
      });
    return res.status(200).json({
      success: 1,
      result: query[0],
    });
  } catch (err) {
    console.error(err);
    res.json({
      error: err,
    });
  }
});

//To fetch all the data where type = handout
router.get('/handouts', auth, async (req, res) => {
  try {
    let sql = `SELECT item_id,item_type,item_name,item_size,updatedAt FROM library_items WHERE item_type='handout' AND customer_id = ${req.user.customer_id} `;

    let query = await db.query(sql);
    if (!query)
      return res.status(400).json({
        success: 0,
        error: 'unable to fetch data',
      });
    return res.status(200).json({
      success: 1,
      result: query[0],
    });
  } catch (err) {
    console.error(err);
    res.json({
      error: err,
    });
  }
});

//To search Particular fileName
router.post('/search', auth, async (req, res) => {
  try {
    const searchInput = req.body.searchInput;
    console.log(searchInput);

    let sql = `SELECT * FROM LIBRARY_TABLE WHERE LIBRARY_ITEM_NAME LIKE '%${searchInput}% AND CUSTOMER_ID = ${req.user.customer_id}  `;

    let query = await db.query(sql, (err, result) => {
      if (err) throw err;
      console.log('RAN successfully');
      res.status(200).json({
        result,
      });
    });
  } catch (err) {
    console.error(err);
    res.json({
      error: err,
    });
  }
});

//To delete a particular item
router.delete('/:id', auth, async (req, res) => {
  try {
    let sql = `DELETE FROM library_items WHERE item_id = ${req.params.id} AND customer_id = ${req.user.customer_id} `;

    let query = await db.query(sql);
    console.log(query);

    res.json({
      success: 1,
      message: 'Successfuly deleted library content',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

//To download
router.get('/download/:id', auth, async (req, res) => {
  try {
    // let libraryContent = await  Library.find({ library_item_id:req.params.id });

    let sql = `SELECT * FROM LIBRARY_TABLE WHERE LIBRARY_ITEM_ID = ${req.params.id}`;
    let query = await db.query(sql, (err, libraryContent) => {
      if (err) throw err;
      console.log('RAN successfully');

      let absPath = libraryContent[0].library_item_location; // Absolute path to the server storage folder
      let fileName = libraryContent[0].library_item_name; // The default name the browser will use to store file

      // console.log(absPath);

      if (
        libraryContent[0].library_item_type == 'quiz' ||
        libraryContent[0].library_item_type == 'handout' ||
        libraryContent[0].library_item_type == 'assignment'
      ) {
        absPath = `${absPath}\\${fileName}.pdf`;
        fileName = fileName + '-Report.pdf';
      } else if (
        libraryContent[0].library_item_type == 'video' ||
        libraryContent[0].library_item_type == 'recording'
      ) {
        absPath = `${absPath}\\${fileName}.mp4`;
        console.log(absPath);
        fileName = fileName + '-Video.mp4';
      } else {
        fileName = fileName + '-ERROR.pdf';
      }

      res.download(absPath, fileName);
    });
  } catch (err) {
    console.error(err);
    res.json({
      error: err,
    });
  }
});

// db.end();

module.exports = router;
