const Router = require('express').Router();
const auth = require('../../../middleware/deepakAuth');
const { db } = require('../connections');
const { LibraryItem } = require('../model');
const { ChapterTable } = require('./chapter_table_model');
const { LessonTable } = require('./lesson_table_model');

Router.get('/:id', auth, async (req, res) => {
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

    const sql2 = `SELECT * from session_tables WHERE session_id=${req.params.id}`;
    const sessionData = await db.query(sql2, { type: db.QueryTypes.SELECT });

    if (!sessionData)
      return res.status(400).json({
        success: 0,
        error: 'could not fetch details',
      });

    const ans = [];

    const getIndex = (doc) => {
      for (let i = 0; i < ans.length; i++)
        if (ans[i].chapter_number === doc.chapter_number) return i;
      return -1;
    };

    result.forEach((doc) => {
      const index = getIndex(doc);
      if (index === -1) {
        const lessons = {
          id: doc.lesson_number,
          lesson_id: doc.lesson_id,
          name: doc.lesson_name,
          video: doc.lesson_video_id,
          assignment: doc.lesson_assignment_id,
          quiz: doc.lesson_quiz_id,
          thumbnail: doc.lesson_handouts_id,
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
          video: doc.lesson_video_id,
          assignment: doc.lesson_assignment_id,
          quiz: doc.lesson_quiz_id,
          thumbnail: doc.lesson_handouts_id,
        });
      }
    });

    // Sort lessons
    ans.forEach((doc) => doc.lesson.sort((a, b) => a.id - b.id));

    return res.status(200).json({
      success: 1,
      sessionData: sessionData[0],
      SessionMaterial: ans,
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

// Router.post('/', auth, async (req, res) => {
//   try {
//     console.log('here', JSON.parse(req.body.bodyPart), req.body.session_id);
//     const chapterData = JSON.parse(req.body.bodyPart);
//     const ans = [];

//     let flg = 0;
//     const session_id = req.body.session_id;
//     if (!session_id)
//       return res.status(400).json({
//         success: 0,
//         error: 'please provide session id',
//       });
//     // saves all files to library_items table
//     if (req.files) {
//       try {
//         for (const [key, value] of Object.entries(req.files)) {
//           const savedLibItem = await LibraryItem.create({
//             session_id,
//             session_type: 'Recorded Session',
//             customer_id: req.user.customer_id,
//             item_name: value.name,
//             item_type: key.split(' ')[4],
//             item_url: 'https://www.google.com',
//             item_size: value.size,
//           });
//           if (!savedLibItem) {
//             flg = 1;
//             return res.status(400).json({
//               success: 0,
//               error: 'failed to save library item',
//             });
//           }
//         }
//       } catch (err) {
//         flg = 1;
//         return res.status(400).json({
//           success: 0,
//           error: 'unable to save files',
//         });
//       }
//     }

//     //save files to server
//     if (req.files) {
//       const filesArray = Object.keys(req.files).map((key) => req.files[key]);
//       // console.log(filesArray)
//       filesArray.forEach((doc) => {
//         doc.mv(`${process.env.FILE_UPLOAD_PATH}${doc.name}`, (err) => {
//           if (err) {
//             flg = 1;
//             console.error(err);
//             return res.status(500).josn({
//               success: 0,
//               error: 'could not upload file',
//               errorReturned: JSON.stringify(err),
//             });
//           }
//         });
//       });
//     }
//     chapterData.forEach(async (doc, index) => {
//       //save chapterdata here and use chapter_id to save lessons data
//       try {
//         const savedChapter = await ChapterTable.create({
//           session_id,
//           customer_id: req.user.customer_id,
//           chapter_name: doc.name,
//           chapter_number: index + 1,
//           chapter_learnings: doc.learning,
//         });

//         if (!savedChapter) {
//           flg = 1;
//           return res.status(400).json({
//             success: 0,
//             error: 'could not save chapter data',
//           });
//         }
//         ans.push(savedChapter);
//         //save lessons data here
//         doc.lessions.forEach(async (d, i) => {
//           try {
//             const savedLesson = await LessonTable.create({
//               session_id,
//               customer_id: req.user.customer_id,
//               chapter_id: savedChapter.chapter_id,
//               lesson_name: JSON.parse(d).name,
//               lesson_number: i + 1,
//               lesson_video_id: 0,
//               lesson_assignment_id: 0,
//               lesson_quiz_id: 0,
//               lesson_handouts_id: 0,
//             });
//             if (!savedLesson) {
//               flg = 1;
//               return res.status(400).json({
//                 success: 0,
//                 error: 'error while saving lession',
//               });
//             }
//             ans.push(savedLesson);
//           } catch (err) {
//             console.log('lesson err', err);
//             flg = 1;
//             return res.status(400).json({
//               success: 0,
//               error: 'unable to save lesson data',
//               errorReturned: JSON.stringify(err),
//             });
//           }
//         });
//       } catch (err) {
//         flg = 1;
//         return res.status(400).json({
//           success: 0,
//           error: 'unable to save chapter data',
//         });
//       }
//     });
//     return res.status(200).json({
//       success: 1,
//       ans,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(400).json({
//       success: 0,
//       error: 'can not update data',
//       errorReturned: JSON.stringify(err),
//     });
//   }
// });

Router.post('/', auth, async (req, res) => {
  console.log(req.body);
  try {
    console.log('here', JSON.parse(req.body.bodyPart), req.body.session_id);
    const chapterData = JSON.parse(req.body.bodyPart);

    let flg = 0;
    const session_id = req.body.session_id;
    if (!session_id)
      return res.status(400).json({
        success: 0,
        error: 'please provide session id',
      });
    // saves all files to library_items table
    if (req.files) {
      try {
        for (const [key, value] of Object.entries(req.files)) {
          const savedLibItem = await LibraryItem.create({
            session_id,
            session_type: 'Recorded Session',
            customer_id: req.user.customer_id,
            item_name: value.name,
            item_type: key.split(' ')[4],
            item_url: 'https://www.google.com',
            item_size: value.size,
          });
          if (!savedLibItem) {
            flg = 1;
            return res.status(400).json({
              success: 0,
              error: 'failed to save library item',
            });
          }
        }
      } catch (err) {
        flg = 1;
        return res.status(400).json({
          success: 0,
          error: 'unable to save files',
        });
      }
    }

    //save files to server
    if (req.files) {
      const filesArray = Object.keys(req.files).map((key) => req.files[key]);
      // console.log(filesArray)
      filesArray.forEach((doc) => {
        doc.mv(`${process.env.FILE_UPLOAD_PATH}${doc.name}`, (err) => {
          if (err) {
            flg = 1;
            console.error(err);
            return res.status(500).josn({
              success: 0,
              error: 'could not upload file',
              errorReturned: JSON.stringify(err),
            });
          }
        });
      });
    }

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
    ON c.session_id=l.session_id AND c.session_id=${session_id} AND c.chapter_id=l.chapter_id AND c.chapter_id=l.chapter_id`;

    const result = await db.query(sql, { type: db.QueryTypes.SELECT });

    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'could not fetch details',
      });

    const ans = [];

    const getIndex = (doc) => {
      for (let i = 0; i < ans.length; i++)
        if (ans[i].chapter_number === doc.chapter_number) return i;
      return -1;
    };

    const isChapterPresent = (arr, doc) => {
      if (!doc.chapter_id) return -1;
      for (let i = 0; i < arr.length; i++)
        if (arr[i].chapter_id == doc.chapter_id) return 1;
      return -1;
    };
    const isLessonPresent = (arr, doc) => {
      if (!doc.lesson_id) return -1;
      for (let i = 0; i < arr.length; i++)
        if (arr[i].lesson_id == doc.lesson_id) return 1;
      return -1;
    };

    result.forEach((doc) => {
      const index = getIndex(doc);
      if (index === -1) {
        const lessons = {
          id: doc.lesson_number,
          lesson_id: doc.lesson_id,
          name: doc.lesson_name,
          video: doc.lesson_video_id,
          assignment: doc.lesson_assignment_id,
          quiz: doc.lesson_quiz_id,
          thumbnail: doc.lesson_handouts_id,
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
          video: doc.lesson_video_id,
          assignment: doc.lesson_assignment_id,
          quiz: doc.lesson_quiz_id,
          thumbnail: doc.lesson_handouts_id,
        });
      }
    });

    // Sort lessons
    ans.forEach((doc) =>
      doc.lesson.sort((a, b) => a.lesson_number - b.lesson_number)
    );

    chapterData.forEach(async (doc, index) => {
      if (isChapterPresent(ans, doc) >= 0) {
        // Update Query
        console.log('update chapter');
        const updateChapter = await ChapterTable.update(
          {
            chapter_name: doc.name,
            chapter_number: index + 1,
            chapter_learnings: doc.learning,
          },
          {
            where: { chapter_id: doc.chapter_id },
          }
        );
        if (!updateChapter)
          return res.status(400).json({
            success: 0,
            error: 'Unable to Update data',
          });

        doc.lessions.forEach(async (l, i) => {
          if (isLessonPresent(doc.lessions, l)) {
            //  Update Lesson here
            console.log('updating lesson ', JSON.parse(l));
            const currentLesson = JSON.parse(l);
            const updatedLesson = await LessonTable.update(
              {
                lesson_name: JSON.parse(l).name,
                lesson_number: i + 1,
                lesson_video_id: 0,
                lesson_assignment_id: 0,
                lesson_quiz_id: 0,
                lesson_handouts_id: 0,
              },
              {
                where: {
                  lesson_id: JSON.parse(l).lesson_id,
                },
              }
            );
            // const updatedLesson = await db.query(`UPDATE lesson_tables
            // SET
            //   lesson_name=${currentLesson.name},
            //   lesson_number= ${i + 1},
            //     lesson_video_id= ${0},
            //     lesson_assignment_id= ${0},
            //     lesson_quiz_id= ${0},
            //     lesson_handouts_id= ${0}
            //   WHERE lesson_id=${currentLesson.lesson_id}
            // `);
            console.log(updatedLesson);
            if (!updatedLesson)
              return res.status(400).json({
                success: 0,
                error: 'Unable to Update data',
              });
          } else {
            // Create Lesson here
            console.log('creatnig lesson in update chapter');
            try {
              const savedLesson = await LessonTable.create({
                session_id,
                customer_id: req.user.customer_id,
                chapter_id: doc.chapter_id,
                lesson_name: JSON.parse(l).name,
                lesson_number: i + 1,
                lesson_video_id: 0,
                lesson_assignment_id: 0,
                lesson_quiz_id: 0,
                lesson_handouts_id: 0,
              });
              if (!savedLesson) {
                flg = 1;
                return res.status(400).json({
                  success: 0,
                  error: 'error while saving lession',
                });
              }
            } catch (err) {
              console.log('lesson err', err);
              flg = 1;
              return res.status(400).json({
                success: 0,
                error: 'unable to save lesson data',
                errorReturned: JSON.stringify(err),
              });
            }
          }
        });
      } else {
        // Create Query
        console.log('create new chapter');
        const savedChapter = await ChapterTable.create({
          session_id,
          customer_id: req.user.customer_id,
          chapter_name: doc.name,
          chapter_number: index + 1,
          chapter_learnings: doc.learning,
        });

        if (!savedChapter) {
          flg = 1;
          return res.status(400).json({
            success: 0,
            error: 'could not save chapter data',
          });
        }
        ans.push(savedChapter);
        //save lessons data here
        doc.lessions.forEach(async (d, i) => {
          try {
            console.log('create new chapter new lesson');
            const savedLesson = await LessonTable.create({
              session_id,
              customer_id: req.user.customer_id,
              chapter_id: savedChapter.chapter_id,
              lesson_name: JSON.parse(d).name,
              lesson_number: i + 1,
              lesson_video_id: 0,
              lesson_assignment_id: 0,
              lesson_quiz_id: 0,
              lesson_handouts_id: 0,
            });
            if (!savedLesson) {
              flg = 1;
              return res.status(400).json({
                success: 0,
                error: 'error while saving lession',
              });
            }
          } catch (err) {
            console.log('lesson err', err);
            flg = 1;
            return res.status(400).json({
              success: 0,
              error: 'unable to save lesson data',
              errorReturned: JSON.stringify(err),
            });
          }
        });
      }
    });
    return res.status(200).json({
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: 0,
      error: 'can not update data',
      errorReturned: JSON.stringify(err),
    });
  }
});

module.exports = Router;
