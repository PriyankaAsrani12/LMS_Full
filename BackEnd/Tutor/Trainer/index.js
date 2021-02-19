const router = require('express').Router();
const webp = require('webp-converter');

const { Trainer } = require('./model');
const auth = require('../middleware/deepakAuth');
const { db } = require('../../common/db/sql');

router.get('/', auth, async (req, res) => {
  try {
    const result = await Trainer.findAll({
      where: { customer_id: req.user.customer_id },
    });
    console.log('from trainer index', result.dataValues);
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'could not find trainers data',
      });
    return res.status(200).json({
      success: 1,
      trainers: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'database error',
      errorReturned: JSON.stringify(err),
    });
  }
});

router.post('/', auth, async (req, res) => {
  const trainerArray = JSON.parse(req.body.values);

  console.log(trainerArray);
  // return res.send('hi');
  try {
    trainerArray.forEach((doc) => console.log(doc));
    trainerArray.forEach(async (trainer) => {
      try {
        if (trainer.trainer_id.length >= 12) {
          //Create Trainer
          try {
            await Trainer.create({
              customer_id: req.user.customer_id,
              trainer_image_url: 'google.com',
              trainer_full_name: trainer.fullname,
              trainer_occupation: trainer.occupation,
              trainer_phone_number: trainer.phone,
              trainer_email: trainer.email,
              trainer_address: trainer.address,
              trainer_website_url: trainer.website,
              trainer_linkedin_id: trainer.linkedin,
              trainer_twitter_id: trainer.twitter,
              trainer_facebook_id: trainer.facebook,
              trainer_instagram_id: trainer.instagram,
              trainer_career_summary: trainer.career_summary,
              trainer_experience: trainer.experience,
            });
          } catch (error) {
            return res.status(500).json({
              success: 0,
              error: "can not upload trainer's data",
              errorReturned: JSON.stringify(err),
            });
          }
        } else {
          //Update Trainer
          try {
            await Trainer.update(
              {
                trainer_image_url: 'google.com',
                trainer_full_name: trainer.fullname,
                trainer_occupation: trainer.occupation,
                trainer_phone_number: trainer.phone,
                trainer_email: trainer.email,
                trainer_address: trainer.address,
                trainer_website_url: trainer.website,
                trainer_linkedin_id: trainer.linkedin,
                trainer_twitter_id: trainer.twitter,
                trainer_facebook_id: trainer.facebook,
                trainer_instagram_id: trainer.instagram,
                trainer_career_summary: trainer.career_summary,
                trainer_experience: trainer.experience,
              },
              { where: { trainer_id: trainer.trainer_id } }
            );
          } catch (error) {
            return res.status(500).json({
              success: 0,
              error: "can not upload trainer's data",
              errorReturned: JSON.stringify(err),
            });
          }
        }
      } catch (err) {
        console.log('inner catch', err);
      }
    });

    if (req.files) {
      const filesArray = Object.keys(req.files).map((key) => req.files[key]);
      // console.log(filesArray)
      filesArray.forEach((doc) => {
        doc.mv(`${process.env.FILE_UPLOAD_PATH_CLIENT}${doc.name}`, (err) => {
          if (err) {
            flg = 1;
            console.error(err);
            return res.status(500).json({
              success: 0,
              error: 'could not upload file',
              errorReturned: JSON.stringify(err),
            });
          }
        });
        webp
          .cwebp(
            `${process.env.FILE_UPLOAD_PATH_CLIENT}${doc.name}`,
            `${process.env.FILE_UPLOAD_PATH_CLIENT}${doc.name.substr(
              0,
              doc.name.lastIndexOf('.')
            )}.webp`,
            '-q 80'
          )
          .then((response) => console.log(response))
          .catch((err) => console.log(err));
        console.log('profile picture updated');
      });
    }
    return res.status(200).json({
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: "can not upload trainer's data",
      errorReturned: JSON.stringify(err),
    });
  }
});

router.get('/specific', auth, async (req, res) => {
  try {
    const result = await Trainer.findAll({
      where: {
        customer_id: req.user.customer_id,
      },
      attributes: ['trainer_id', 'trainer_full_name'],
    });

    const sessions = await db.query(
      `SELECT session_name,session_id FROM session_tables WHERE customer_id=${req.user.customer_id}`,
      { type: db.QueryTypes.SELECT }
    );

    return res.status(200).json({
      success: 1,
      result,
      sessions,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: 0,
      error: 'Could not find trainer data',
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        success: 0,
        error: 'Trainer id not provided',
      });
    await Trainer.destroy({ where: { trainer_id: req.params.id } });
  } catch (error) {
    return res.status(400).json({
      success: 0,
      error: 'Unable to delete Trainer',
    });
  }
});

module.exports = router;
