const mysql = require('mysql');
const { db, Session } = require('./models');
const { zoomApi } = require('./zoomAPi');
const rp = require('request-promise');
const router = require('express').Router();
const auth = require('../middleware/deepakAuth');
const { Op } = require('sequelize');
const webp = require('webp-converter');

router.post('/createLiveSession', auth, async (req, res) => {
  console.log('❓', req.body);
  // return res.status(200).json({success:1})

  try {
    let {
      session_name,
      description,
      occurance,
      duration,
      session_tags,
      session_fee,
      trainer,
      startDateRange,
      session_fee_type,
      // session_end_date,
      time,
      session_associated_course_id,
      session_enable_registration,
    } = req.body.values;

    session_description = description;
    session_duration = duration;
    session_occurance = occurance;
    session_associated_course_id = '10';
    session_start_date = startDateRange;
    session_trainer_name = trainer;
    session_start_time = time;

    console.log('❓', session_name);

    // Find if session name already exists
    const sessionExist = await Session.findOne({
      where: { customer_id: req.user.customer_id, session_name },
    });
    console.log(sessionExist);
    if (sessionExist)
      return res.status(400).json({
        success: 0,
        error: 'Sesison name already exists',
      });

    // finding associated courses
    session_associated_course_id = await Session.findAll({
      where: {
        session_name: session_associated_course_id,
      },
    });

    console.log(session_associated_course_id);

    // let type;

    /*once->pass no parameter
	daily->1
	weekly->2
  monthly -> 3*/

    let type = 4,
      Zoom_body;
    if (session_occurance == 'daily') type = 1;
    if (session_occurance == 'weekly') type = 2;
    if (session_occurance == 'monthly') type = 3;

    // creating zoom meet
    if (type == 4) {
      Zoom_body = {
        title: session_name,
        start_time: session_start_time,
        duration: session_duration,
        timezone: 'IN',
      };
    } else {
      Zoom_body = {
        title: session_name,
        type: type,
        start_time: session_start_time,
        duration: session_duration,
        timezone: 'IN',
      };
    }

    // Zoom_res=await zoomApi(`https://api.zoom.us/v2/users/${req.user.customer_zoom_email}/meetings`,'POST',`${req.user.customer_zoom_jwt_token}`,{status: 'active'},Zoom_body);
    Zoom_res = await zoomApi(
      `https://api.zoom.us/v2/users/${process.env.EMAIL_ID}/meetings`,
      'POST',
      process.env.JWT_TOKEN_ZOOM_VEDANT,
      { status: 'active' },
      Zoom_body
    );
    // console.log('❓',Zoom_res)

    const session = await Session.create({
      customer_id: req.user.customer_id,
      // session_id:'2',
      // customer_id:'10',
      session_type: 'Live Session',
      session_name,
      session_description,
      session_trainer_id: Zoom_res.host_id,
      session_duration,
      session_fee,
      session_fee_type,
      session_trainer_name,
      session_tags,
      session_link: Zoom_res.join_url,
      session_uploaded_on: Zoom_res.created_at,
      session_occurance,
      session_start_date,
      session_start_time,
      // session_registration,
      session_associated_course_id,
      session_zoom_code: Zoom_res.id,
      session_zoom_password: Zoom_res.password,
    });
    console.log(session.session_start_time);
    // console.log('new Session created', session)
    return res.status(200).json({
      success: 1,
      session,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'could not create session',
      errorMessage: JSON.stringify(err),
    });
  }
});

router.post('/createRecordedSession', auth, async (req, res) => {
  console.log(req.user, req.body);
  try {
    let {
      session_name,
      session_description,
      session_duration,
      session_fee,
      session_tags,
      session_trainer_name,
      session_fee_type,
      session_associated_course_id = '10',
    } = req.body.values;

    if (!session_name || !session_description || !session_duration)
      return res.status(500).json({
        success: 0,
        error: 'Data Incomplete',
      });

    // Find if session name already exists
    const sessionExist = await Session.findOne({
      where: { customer_id: req.user.customer_id, session_name },
    });
    console.log(sessionExist);
    if (sessionExist)
      return res.status(400).json({
        success: 0,
        error: 'Sesison name already exists',
      });

    // finding associated courses
    session_associated_course_id = Session.findAll({
      where: { session_id: session_associated_course_id },
    });

    // creating zoom meet
    Zoom_body = {
      title: session_name,
      type: 2,
      // start_time: session_start_time,
      start_time: '10:00:00',
      duration: session_duration,
      timezone: 'IN',
    };

    Zoom_res = await zoomApi(
      `https://api.zoom.us/v2/users/${process.env.EMAIL_ID}/meetings`,
      'POST',
      process.env.JWT_TOKEN_ZOOM_VEDANT,
      { status: 'active' },
      Zoom_body
    );
    console.log('❓', Zoom_res);

    const session = await Session.create({
      customer_id: req.user.customer_id,
      session_type: 'Recorded Session',
      session_name,
      session_description,
      session_trainer_id: Zoom_res.host_id,
      session_duration,
      session_tags,
      session_fee,
      session_fee_type,
      session_trainer_name,
      session_link: Zoom_res.join_url,
      session_uploaded_on: Zoom_res.created_at,
      // session_occurance,
      // session_start_date,
      // session_start_time,
      session_registration: 0,
      session_associated_course_id,
      session_zoom_code: Zoom_res.id,
      session_zoom_password: Zoom_res.password,
    });
    // console.log('new Session created', session)
    if (!session)
      return res.status(500).json({
        success: 0,
        error: 'Could not create session',
      });
    return res.status(200).json({
      success: 1,
      session,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'Could not create session',
      errorReturned: JSON.stringify(err),
    });
  }
});

router.get('/FindAllSession', auth, async (req, res) => {
  console.log('route is ', req.query.route, 'sort filter: ', req.query.sort);
  const route = req.query.route || 'findall';
  const sortFilter = req.query.sort || 'session_name';
  const searchSession = req.query.search || '';

  console.log(route, sortFilter, searchSession);

  if (route == 'findall') {
    const sqlCheck = await Session.findAll({
      where: {
        customer_id: req.user.customer_id,
        session_name: {
          [Op.like]: `%${searchSession}%`,
        },
      },
      order: [[sortFilter, 'ASC']],
      attributes: [
        'session_id',
        'session_description',
        'session_type',
        'session_name',
        'session_start_date',
        'session_tags',
        'session_fee',
        'session_registration',
        'session_trainer_name',
      ],
    });

    // console.log(sqlCheck.dataValues,sqlCheck);
    if (!sqlCheck)
      return res.status(400).json({ success: 0, error: 'could not found' });
    return res.status(200).json({ success: 1, sessions: sqlCheck });
  }

  if (route == 'liveSession') {
    const sqlCheck = await Session.findAll({
      where: {
        customer_id: req.user.customer_id,
        session_type: 'Live Session',
        session_name: {
          [Op.like]: `%${searchSession}%`,
        },
      },
      order: [[sortFilter, 'ASC']],
      attributes: [
        'session_id',
        'session_description',
        'session_type',
        'session_name',
        'session_start_date',
        'session_tags',
        'session_fee',
        'session_registration',
        'session_trainer_name',
      ],
    });

    // console.log(sqlCheck.dataValues,sqlCheck);
    if (!sqlCheck)
      return res.status(400).json({ success: 0, error: 'could not found' });
    return res.status(200).json({ success: 1, sessions: sqlCheck });
  }

  if (route == 'recordedSession') {
    const sqlCheck = await Session.findAll({
      where: {
        customer_id: req.user.customer_id,
        session_type: 'Recorded Session',
        session_name: {
          [Op.like]: `%${searchSession}%`,
        },
      },
      order: [[sortFilter, 'ASC']],
      attributes: [
        'session_id',
        'session_description',
        'session_type',
        'session_name',
        'session_start_date',
        'session_tags',
        'session_fee',
        'session_registration',
        'session_trainer_name',
      ],
    });

    // console.log(sqlCheck.dataValues,sqlCheck);
    if (!sqlCheck)
      return res.status(400).json({ success: 0, error: 'could not found' });
    return res.status(200).json({ success: 1, sessions: sqlCheck });
  }

  // if (route == 'launched') {
  //     const sqlCheck = await Session.findAll({
  //       where: {
  //         customer_id: req.user.customer_id,
  //         session_launch:'launched'
  //       },
  // order: [
  //   [sortFilter, 'ASC'],
  // ],
  //       attributes: ['session_id', 'session_description','session_type','session_name','session_start_date','session_tags','session_fee','session_registration','session_trainer_id],
  //     })

  //     console.log(sqlCheck.dataValues,sqlCheck);
  //     if (!sqlCheck)
  //       return res.status(400).json({ success: 0, error: 'could not found' });
  //     return res.status(200).json({ success:1,sessions:sqlCheck})
  // }

  // if (route == 'yetToLaunch') {
  //   const sqlCheck = await Session.findAll({
  //     where: {
  //       customer_id: req.user.customer_id,
  //       session_launch:'launch'
  //     },
  //   order: [
  //     [sortFilter, 'ASC'],
  // ],
  //     attributes: ['session_id', 'session_description','session_type','session_name','session_start_date','session_tags','session_fee','session_registration','session_trainer_id],
  //   })

  //   console.log(sqlCheck.dataValues,sqlCheck);
  //   if (!sqlCheck)
  //     return res.status(400).json({ success: 0, error: 'could not found' });
  //   return res.status(200).json({ success:1,sessions:sqlCheck})
  // }
});

router.get('/FindSessionById/:id', auth, async (req, res) => {
  console.log(req.params);
  // res.send(Session.findAll({where:{session_id:req.params.id}}));
  const sqlCheck = await Session.findOne({
    where: {
      session_id: req.params.id,
    },
  });

  console.log(sqlCheck, sqlCheck.dataValues);
  if (!sqlCheck)
    return res.status(400).json({
      success: 0,
      error: 'Could not find session',
    });

  return res.status(200).json({
    success: 1,
    session: sqlCheck,
  });
});

router.post('/updateSession', auth, async (req, res) => {
  console.log(req.body);
  try {
    const {
      session_id,
      session_description,
      session_tagline,
      session_tags,
    } = req.body.values;

    if (!session_id)
      return res.status(200).json({
        success: 0,
        error: 'Please provide session id ',
      });

    if (!session_description)
      return res.status(200).json({
        success: 0,
        error: 'Please provide session description ',
      });

    const session = await Session.findOne({
      where: {
        session_id,
      },
    });

    if (!session)
      return res.status(400).json({
        sucess: 0,
        error: 'Could not find session',
      });

    if (session.session_type == 'Recorded Session') {
      session.session_tagline = session_tagline;
      session.session_tags = session_tags;
    }

    session.session_description = session_description;
    const updatedSession = await session.save();

    console.log(updatedSession);
    return res.status(200).json({
      success: 1,
      session: updatedSession,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: 0,
      error: 'could not update session details',
      errorReturned: err,
    });
  }
});

router.post('/updateRecordedSession', auth, async (req, res) => {
  console.log(req.body.values);
  try {
    const {
      session_tags,
      session_id,
      session_description,
      session_tagline,
    } = req.body.values;

    if (!session_id)
      return res.status(200).json({
        success: 0,
        error: 'Please provide session id ',
      });

    if (!session_description)
      return res.status(200).json({
        success: 0,
        error: 'Please provide session description ',
      });

    if (!session_tags)
      return res.status(200).json({
        success: 0,
        error: 'Please provide session tags ',
      });

    const session = await Session.findOne({
      where: {
        session_id,
      },
    });

    if (!session)
      return res.status(400).json({
        sucess: 0,
        error: 'Could not find session',
      });

    session.session_tags = session_tags;
    session.session_description = session_description;
    session.session_tagline = session_tagline;

    const updatedSession = await session.save();

    console.log(updatedSession);
    return res.status(200).json({
      success: 1,
      session: updatedSession,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'could not update session',
      errorReturned: err,
    });
  }
});

router.post('/deleteSession', async (req, res) => {
  console.log(req.body);
  const session = await Session.destroy({
    where: {
      firstName: 'Jane',
    },
  });
  console.log('new Session created', session);
});

router.post('/upload/thumbnail', auth, async (req, res) => {
  try {
    console.log(req.files, req.body);
    const thumbnail = req.files.thumbnail;
    const session_id = req.body.session_id;

    if (!req.files.thumbnail)
      return res.status(400).json({
        success: 0,
        error: 'thumbnail not provided',
      });
    if (!session_id)
      return res.status(400).json({
        success: 0,
        error: 'session id not provided',
      });

    const file = req.files.thumbnail;
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
      console.log('Thumbnail updated');
    });

    const result = await Session.update(
      { session_thumbnail: ` URL OF ${thumbnail}` },
      { where: { session_id } }
    );
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'unable to upload thumbnail',
      });
    return res.status(200).json({
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'unable to upload thumbnail',
      errorReturned: JSON.stringify(err),
    });
  }
});
module.exports = router;
