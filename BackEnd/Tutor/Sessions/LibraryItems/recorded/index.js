const Router = require('express').Router();
const auth = require('../../../middleware/deepakAuth');
const { db } = require('../../../../common/db/sql');
const { LibraryItem } = require('../model');
const { ChapterTable } = require('./chapter_table_model');
const { LessonTable } = require('./lesson_table_model');
const cmd = require('node-cmd');
const path =require("path");
Router.get('/:id/trainer/:trainer_id', auth, async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        success: 0,
        error: 'Session id not provided',
      });
    if (!req.params.trainer_id)
      return res.status(400).json({
        success: 0,
        error: 'trainer id not provided',
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
    const sql3 = `SELECT item_id,item_name,item_url from library_items WHERE session_id=${req.params.id} AND customer_id=${req.user.customer_id}`;
    const LibraryItems = await db.query(sql3, { type: db.QueryTypes.SELECT });

    let TrainerData;
    if (req.params.trainer_id == 999) {
      console.log('here');
      TrainerData = await db.query(
        `SELECT
       customer_career_summary as trainer_career_summary,
       CONCAT(customer_first_name,' ',customer_last_name) as trainer_full_name,
       customer_occupation as trainer_occupation,
       customer_experience as trainer_experience
      FROM customer_tables WHERE customer_id=${req.user.customer_id}`,
        { type: db.QueryTypes.SELECT }
      );
    } else {
      const sql4 = `SELECT  trainer_full_name,trainer_experience,trainer_career_summary,trainer_occupation   from trainer_profiles WHERE customer_id=${req.user.customer_id} AND trainer_id=${req.params.trainer_id}`;
      TrainerData = await db.query(sql4, { type: db.QueryTypes.SELECT });
    }
    if (!TrainerData)
      return res.status(400).json({
        success: 0,
        error: 'Unable to find trainer data',
      });

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

    const getItemUrl = (item_id) => {
      for (let i = 0; i < LibraryItems.length; i++)
        if (LibraryItems[i].item_id == item_id) {
          return LibraryItems[i].item_url;
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

          videoUrl: getItemUrl(doc.lesson_video_id),
          assignmentUrl: getItemUrl(doc.lesson_assignment_id),
          quizUrl: doc.lesson_quiz_id,
          thumbnailUrl: doc.session_thumbnail,
          handoutsUrl: getItemUrl(doc.lesson_handouts_id),
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

          videoUrl: getItemUrl(doc.lesson_video_id),
          assignmentUrl: getItemUrl(doc.lesson_assignment_id),
          quizUrl: doc.lesson_quiz_id,
          thumbnailUrl: doc.session_thumbnail,
          handoutsUrl: getItemUrl(doc.lesson_handouts_id),
        });
      }
    });

    //sort chapters
    ans.sort((a, b) => a.chapter_number - b.chapter_number);
    // Sort lessons
    ans.forEach((doc) => doc.lesson.sort((a, b) => a.id - b.id));

    return res.status(200).json({
      success: 1,
      sessionData: sessionData[0],
      SessionMaterial: ans,
      trainerData: TrainerData[0],
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

Router.post('/', auth, async (req, res) => {
  
  const chapterData = req.body.values.SessionMaterial;
  console.log(chapterData);
  chapterData.forEach((doc) => console.log(doc.lesson));
  try {
    const chapterData = req.body.values.SessionMaterial;
    let flg = 0;
    const session_id = req.body.values.session_id;
    if (!session_id)
      return res.status(400).json({
        success: 0,
        error: 'please provide session id',
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
    ON c.session_id=l.session_id AND c.session_id=${session_id} AND c.chapter_id=l.chapter_id AND c.chapter_id=l.chapter_id`;

    const result = await db.query(sql, { type: db.QueryTypes.SELECT });

    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'could not fetch details',
      });
    const sql3 = `SELECT item_id,item_name,item_url from library_items WHERE session_id=${session_id} AND customer_id=${req.user.customer_id}`;
    const LibraryItems = await db.query(sql3, { type: db.QueryTypes.SELECT });
    const getItemName = (item_id) => {
      for (let i = 0; i < LibraryItems.length; i++)
        if (LibraryItems[i].item_id == item_id) {
          console.log(LibraryItems[i], LibraryItems[i].item_name);
          return LibraryItems[i].item_name;
        }
    };
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
      // console.log(arr, doc, 'doc.lesson_id : ', typeof doc.lesson_id);
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
          video: getItemName(doc.lesson_video_id),
          assignment: getItemName(doc.lesson_assignment_id),
          quiz: doc.lesson_quiz_id,
          thumbnail: getItemName(doc.lesson_handouts_id),
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

        doc.lesson.forEach(async (l, i) => {
          console.log(isLessonPresent(ans[index].lesson, l));
          if (isLessonPresent(ans[index].lesson, l) >= 0) {
            //  Update Lesson here
            console.log('updating lesson ', l);
            const currentLesson = l;
            const updatedLesson = await LessonTable.update(
              {
                lesson_name: l.name,
                lesson_number: i + 1,
                lesson_video_id: l.video,
                lesson_assignment_id: l.assignment,
                lesson_quiz_id: l.quiz,
                lesson_handouts_id: l.handouts,
              },
              {
                where: {
                  lesson_id: l.lesson_id,
                },
              }
            );

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
                lesson_name: l.name,
                lesson_number: i + 1,
                lesson_video_id: l.video,
                lesson_assignment_id: l.assignment,
                lesson_quiz_id: l.quiz,
                lesson_handouts_id: l.handouts,
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
        doc.lesson.forEach(async (d, i) => {
          try {
            console.log('create new chapter new lesson');
            const savedLesson = await LessonTable.create({
              session_id,
              customer_id: req.user.customer_id,
              chapter_id: savedChapter.chapter_id,
              lesson_name: d.name,
              lesson_number: i + 1,
              lesson_video_id: d.video,
              lesson_assignment_id: d.assignment,
              lesson_quiz_id: d.quiz,
              lesson_handouts_id: d.handouts,
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

Router.post('/lessonMaterial', auth, async (req, res) => {
  try {
    console.log(req.files.file);
    if (!req.files || !req.files.file)
      return res.status(400).json({
        success: 0,
        error: 'Please Provide Some Attachment',
      });

      console.log("Body",req.body);
    if (!req.body.session_id)
      return res.status(400).json({
        success: 0,
        error: 'Session id not provided',
      });

    const bData = await db.query(
      `SELECT customer_storage_zone_user_key,customer_storage_zone_name FROM customer_tables WHERE customer_id=${req.user.customer_id} `,
      { type: db.QueryTypes.SELECT }
    );
    console.log(bData);
    const file = req.files.file;

    file.mv(`./${process.env.FILE_UPLOAD_PATH_CLIENT}/${file.name}`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: 0,
          error: 'could not upload file',
          errorReturned: JSON.stringify(err),
        });
      }
      console.log('saved ');

      let nameis=file.name.split('.').slice(0, -1).join('.');
      let newname=`${nameis}-${Date.now()}${path.parse(file.name).ext}`;
      
    console.log(newname);
    if(path.parse(file.name).ext=='.pdf'||path.parse(file.name).ext=='.word'){
                if(req.body.fileType=="assignment"){
                      const command=  cmd.runSync(`
                  bnycdn cp -s ${bData[0].customer_storage_zone_name}  ./upload/${file.name}  ./${bData[0].customer_storage_zone_name}/assignments/upload/${newname}
                  `,
                  async (err, data, stderr) => {
                      if (err) console.log(err,"upload error");
                      else {
                      console.log("data is ",data);
                      
                      }
                    })
                }
                if(req.body.fileType=="handouts"){
                  const command=  cmd.runSync(`
              bnycdn cp -s ${bData[0].customer_storage_zone_name}  ./upload/${file.name}  ./${bData[0].customer_storage_zone_name}/handouts/upload/${newname}
              `,
              async (err, data, stderr) => {
                  if (err) console.log(err,"upload error");
                  else {
                  console.log("data is ",data);
                  
                  }
                })
              }
    }


      if(req.body.fileType=="video"){
        const command=  cmd.runSync(`
        bnycdn cp -s ${bData[0].customer_storage_zone_name}  ./upload/${file.name}  ./${bData[0].customer_storage_zone_name}/recordedvideos/upload/${newname}
        `,
        async (err, data, stderr) => {
            if (err) console.log(err,"upload error");
            else {
            console.log("data is ",data);
            
            }
          })
      console.log(command);
      }
    });

    const savedItem = await LibraryItem.create({
      session_id: req.body.session_id,
      session_type: 'Recorded Session',
      customer_id: req.user.customer_id,
      item_name: req.files.file.name,
      item_type: req.body.fileType,
      item_url: 'www.google.com',
      item_size: req.files.file.size,
    });

    if (!savedItem)
      return res.status(400).json({
        success: 0,
        error: 'Unable to upload video',
      });
    if (
      (req.body.lesson_id && req.body.lesson_id != 'unknown_lesson_id') ||
      req.body.lesson_id != ''
    ) {
      const updatedLesson = await LessonTable.update(
        {
          [`lesson_${req.body.fileType}_id`]: savedItem.dataValues.item_id,
        },
        {
          where: {
            lesson_id: req.body.lesson_id,
          },
        }
      );
      console.log(updatedLesson);
    }

    return res.status(200).json({
      success: 1,
      item_id: savedItem.dataValues.item_id,
      item_name: savedItem.dataValues.item_name,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: 0,
      error: 'Could not upload video',
      errorReturned: JSON.stringify(err),
    });
  }
});

Router.delete('/deleteChapter/:id', auth, async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        success: 0,
        error: 'Please provide chapter id',
      });
    const deletedChapter = await ChapterTable.destroy({
      where: { chapter_id: req.params.id },
    });
    const deletedLessons = await LessonTable.destroy({
      where: { chapter_id: req.params.id },
    });
    console.log(deletedChapter, deletedLessons);
    return res.status(200).json({
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: 0,
      error: 'can not delete chapter data',
      errorReturned: JSON.stringify(err),
    });
  }
});

Router.delete('/deleteLesson/:id', auth, async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        success: 0,
        error: 'Please provide chapter id',
      });
    const deletedLessons = await LessonTable.destroy({
      where: { lesson_id: req.params.id },
    });
    console.log(deletedLessons);
    return res.status(200).json({
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: 0,
      error: 'can not delete Lesson data',
      errorReturned: JSON.stringify(err),
    });
  }
});
module.exports = Router;
