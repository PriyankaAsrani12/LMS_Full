const router = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');
const { db } = require('../../common/db/sql');

router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT session_id,session_name,session_tagline,session_tags,session_fee,session_thumbnail FROM session_tables WHERE session_type="recorded session"',
      { type: db.QueryTypes.SELECT }
    );
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'could not fetch session data',
      });
    return res.status(200).json({
      success: 1,
      sessions: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'unable to find sessions',
      errorReturned: JSON.stringify(err),
    });
  }
});

router.get('/live', verifyToken, async (req, res) => {
  console.log(req.url);
  try {
    const result = await db.query(
      'SELECT session_id,session_name,session_description,session_tagline,session_tags,session_fee,session_thumbnail FROM session_tables WHERE session_type="live session"',
      { type: db.QueryTypes.SELECT }
    );
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'could not fetch session data',
      });

    return res.status(200).json({
      success: 1,
      sessions: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'unable to find sessions',
      errorReturned: JSON.stringify(err),
    });
  }
});

// router.get('/details/:id', verifyToken, async (req, res) => {
//   try {
//     console.log(req.params.id);
//     if (!req.params.id)
//       return res.status(400).json({
//         success: 0,
//         error: 'session id not provided',
//       });
//     const result = await db.query(
//       `SELECT
//       session_name,
//       session_description,
//       session_thumbnail,
//       session_fee,
//       session_duration,
//       chapter_learnings
//       from session_tables as s INNER JOIN chapter_tables as c where s.session_id=c.session_id AND s.session_id=${req.params.id} `,
//       { type: db.QueryTypes.SELECT }
//     );

//     console.log(result);
//     if (!result || !result.length) {
//       try {
//         const onlySession = await db.query(
//           `SELECT
//       session_name,
//       session_description,
//       session_thumbnail,
//       session_fee,
//       session_duration
//       from session_tables  WHERE session_id=${req.params.id}`,
//           { type: db.QueryTypes.SELECT }
//         );
//         console.log(onlySession);
//         if (!onlySession)
//           return res.status(400).json({
//             success: 0,
//             error: 'Requested session does not exists',
//           });
//         onlySession[0].chapter_learnings = [];
//         return res.status(200).json({
//           success: 1,
//           session: onlySession[0],
//         });
//       } catch (e) {
//         return res.status(400).json({
//           success: 0,
//           error: 'Could not fetch details',
//         });
//       }
//       // return res.status(400).json({
//       //   success: 0,
//       //   error: 'Requested session does not exists',
//       // });
//     }

//     const chapter_learnings = result.map((doc) => doc.chapter_learnings);

//     const session = {
//       session_name: result[0].session_name,
//       session_description: result[0].session_description,
//       session_thumbnail: result[0].session_thumbnail,
//       session_fee: result[0].session_fee,
//       session_duration: result[0].session_duration,
//       chapter_learnings,
//     };

//     console.log(session);

//     return res.status(200).json({ success: 1, session });
//   } catch (err) {
//     console.log(err);

//     return res.status(400).json({
//       success: 0,
//       error: 'Could not fetch details',
//     });
//   }
// });

router.get('/details/:id', verifyToken, async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        success: 0,
        error: 'Session id not provided',
      });
    const sql = `SELECT
       c.chapter_id,
       chapter_number,
       chapter_name,
       chapter_learnings,
       l.lesson_id,
       lesson_number,
       lesson_name ,
       lesson_video_id,
       lesson_assignment_id,
       lesson_quiz_id,
       lesson_handouts_id
       FROM  chapter_tables as c
       INNER JOIN lesson_tables as l
       ON c.session_id=l.session_id AND c.session_id=${req.params.id} AND c.chapter_id=l.chapter_id AND c.chapter_id=l.chapter_id`;

    const result = await db.query(sql, { type: db.QueryTypes.SELECT });
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'could not fetch details',
      });

    const sql2 = `SELECT session_id,session_name,
    session_description,session_trainer_name,session_duration,session_fee,
    session_trainer_id,session_thumbnail,session_tagline
    from session_tables WHERE session_id=${req.params.id}`;
    const sessionData = await db.query(sql2, { type: db.QueryTypes.SELECT });

    if (!sessionData)
      return res.status(400).json({
        success: 0,
        error: 'could not fetch details',
      });
    const sql3 = `SELECT item_id,item_name from library_items WHERE session_id=${req.params.id}`;
    const LibraryItems = await db.query(sql3, { type: db.QueryTypes.SELECT });

    const ans = [];

    const getIndex = (doc) => {
      for (let i = 0; i < ans.length; i++)
        if (ans[i].chapter_number === doc.chapter_number) return i;
      return -1;
    };

    const getItemName = (item_id) => {
      for (let i = 0; i < LibraryItems.length; i++)
        if (LibraryItems[i].item_id == item_id) {
          console.log(LibraryItems[i], LibraryItems[i].item_name);
          return LibraryItems[i].item_name;
        }
    };

    result.forEach((doc) => {
      const index = getIndex(doc);
      if (index === -1) {
        const lessons = {
          id: doc.lesson_number,
          lesson_id: doc.lesson_id,
          name: doc.lesson_name,
          video: getItemName(doc.lesson_video_id),
          assignment: getItemName(doc.lesson_assignment_id),
          quiz: doc.lesson_quiz_id,
          thumbnail: doc.session_thumbnail,
          handouts: getItemName(doc.lesson_handouts_id),
        };
        ans.push({
          chapter_id: doc.chapter_id,
          chapter_number: doc.chapter_number,
          learning: doc.chapter_learnings,
          name: doc.chapter_name,
          lesson: [lessons],
        });
      } else {
        ans[index].lesson.push({
          id: doc.lesson_number,
          lesson_id: doc.lesson_id,
          name: doc.lesson_name,
          video: getItemName(doc.lesson_video_id),
          assignment: getItemName(doc.lesson_assignment_id),
          quiz: doc.lesson_quiz_id,
          thumbnail: getItemName(doc.lesson_handouts_id),
        });
      }
    });

    //sort chapters
    ans.sort((a, b) => a.chapter_number - b.chapter_number);
    // Sort lessons
    ans.forEach((doc) => doc.lesson.sort((a, b) => a.id - b.id));

    const chapter_learnings = ans.map((doc) => doc.learning);
    const session = sessionData[0];
    session.chapter_learnings = chapter_learnings;

    return res.status(200).json({
      success: 1,
      session: sessionData[0],
      ans,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'Unable to fetch details',
      errorReturned: err,
    });
  }
});
module.exports = router;
