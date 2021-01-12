const router = require('express').Router();
const webp = require('webp-converter');

const { Trainer } = require('./model');
const auth = require('../middleware/deepakAuth');

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
  // return res.send('hi');
  try {
    let flg = 0;
    //save files

    if (!flg) {
      await Trainer.destroy({ where: { customer_id: req.user.customer_id } });
      const trainerArray = JSON.parse(req.body.values);
      trainerArray.forEach((doc) => console.log(doc));
      trainerArray.forEach(async (trainer) => {
        try {
          const result = await Trainer.create({
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
          if (!result)
            return res.status(500).json({
              success: 0,
              error: "can not upload trainer's data",
            });
        } catch (err) {
          console.log('inner catch', err);
          return res.status(500).json({
            success: 0,
            error: "can not upload trainer's data",
            errorReturned: JSON.stringify(err),
          });
        }
      });
    }
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
    if (!flg)
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

router.post('/demo', auth, async (req, res) => {
  // return res.send('hi');
  try {
    const trainerArray = JSON.parse(req.body.values);

    trainerArray.forEach(async (trainer) => {
      if (trainer.trainer_id) {
        //    Run Update Query
        try {
          const result = await Trainer.update(
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
          if (!result)
            return res.status(400).json({
              success: 0,
              error: 'Can  not Update Trainer data',
            });
          console.log(result);
        } catch (err) {
          console.log('inner catch', err);
          return res.status(500).json({
            success: 0,
            error: "can update  trainer's data",
            errorReturned: JSON.stringify(err),
          });
        }
      } else {
        //   Run create Query
        try {
          const result = await Trainer.create({
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
          if (!result)
            return res.status(500).json({
              success: 0,
              error: "can not upload trainer's data",
            });
          console.log(result);
        } catch (err) {
          console.log('inner catch', err);
          return res.status(500).json({
            success: 0,
            error: "can not upload trainer's data",
            errorReturned: JSON.stringify(err),
          });
        }
      }
    });

    if (req.files) {
      const filesArray = Object.keys(req.files).map((key) => req.files[key]);
      // console.log(filesArray)
      filesArray.forEach((doc) => {
        doc.mv(`${process.env.FILE_UPLOAD_PATH_CLIENT}${doc.name}`, (err) => {
          if (err) {
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

module.exports = router;
