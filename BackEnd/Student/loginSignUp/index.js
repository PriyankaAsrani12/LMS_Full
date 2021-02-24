const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { db } = require('../../common/db/sql');
const Student = require('./model');
const verifyToken = require('../middlewares/verifyToken');
const {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} = require('../../common/emails/account');
const webp = require('webp-converter');

const {
  sendsms,
} = require('../../common/completed_test_modules/sendSmsModule');
const { User } = require('../../Tutor/loginSignup/customer/models');

//Create a new User
router.post('/register', async (req, res) => {
  console.log('❓', req.body.values);
  try {
    let {
      student_first_name,
      student_last_name,
      student_phone_number,
      student_email,
      student_password,
      using_google = false,
      customer_id,
    } = req.body.values;
console.log(customer_id);
    //Don't change it to let otherwise DB is will not connect
    sqlCheck = await Student.findOne({
      where: {
        student_email,
      },
    });

    if (sqlCheck) {
      return res.json({
        success: 0,
        error: 'Email Aready Registered',
      });
    }

    if (!using_google) {
      const salt = bcrypt.genSaltSync(10);
      student_password = bcrypt.hashSync(student_password, salt);
    }
    //Change it to customer email and customer name
    let name = student_first_name;
    if (student_last_name) name = `${student_first_name} ${student_last_name}`;

    // Take customer_id from database according to particular subdomain ...
    // send mail if value of communication_email_signup is 1
    // if (!customer_id) customer_id = 1;

    const customer = await db.query(
      `SELECT communication_email_signup,communication_message_signup FROM customer_tables WHERE customer_id=${customer_id}`,
      { type: db.QueryTypes.SELECT }
    );

    console.log(customer);

    if (customer.communication_email_signup) {
      let temp = await sendWelcomeEmail(student_email, name);
      console.log('🚀', temp);
    }

    // sending sms
    if (!using_google && customer.communication_message_signup) {
      const result = await sendsms(student_phone_number, 'test');
      console.log(result);
    }
    const user = await Student.create({
      student_first_name,
      student_last_name,
      customer_id,
      student_phone_number,
      student_email,
      student_password,
    });

    //  res.status(200).json({
    //     success:1,
    //     message:"User Successfully Created"
    // });
    res.redirect(307, '/student/auth/login');
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'Database connection error',
      errorReturned: err,
    });
  }
});

// sigin in a user
router.post('/login', async (req, res) => {
  console.log(req.body.values);

  try {
    const {
      student_email,
      student_password = '',
      using_google = false,
    } = req.body.values;
console.log(req.body);
    const sqlCheck = await Student.findOne({
      where: {
        student_email,
      },
      attributes: ['student_id', 'student_password'],
    });
    if (!sqlCheck) {
      return res.status(200).json({
        success: 0,
        error: 'Email not registered',
      });
    } else {
      if (!using_google) {
        let storedPassword = sqlCheck.dataValues.student_password;
        const matchPassword = bcrypt.compareSync(
          student_password,
          storedPassword
        );
        console.log(matchPassword);
        if (!matchPassword) {
          return res.status(200).json({
            success: 0,
            error: 'Incorrect Password',
          });
        }
      }

      const jwtToken = jwt.sign(
        { student_id: sqlCheck.dataValues.student_id },
        process.env.JWT_KEY,
        {
          expiresIn: '1h',
        }
      );

      res.cookie('auth-token', jwtToken, {
        httpOnly: true,
      });

      return res.status(200).json({
        success: 1,
        message: 'Login Successful',
        token: jwtToken,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'Database connection error',
      errorReturned: err,
    });
  }
});

router.post('/forgotPassword', async (req, res) => {
  try {
    const { email } = req.body.values;
    sqlCheck = await Student.findOne({
      where: {
        student_email: email,
      },
      attributes: ['student_id'],
    });
    console.log('RAN SUCCESSFULLY');
    // console.log('❓',sqlCheck.dataValues)

    if (!sqlCheck) {
      console.log('email not found');
      return res.status(500).json({
        success: 0,
        error: 'Email not registered',
      });
    } else {
      const encryptedData = jwt.sign(
        { email, valid: Date.now() },
        process.env.JWT_KEY,
        {
          expiresIn: '1d',
        }
      );
      console.log(encryptedData);

      let temp = await sendPasswordResetEmail(email, encryptedData);
      console.log('🚀', temp);
      return res.status(200).json({
        success: 1,
        error: '',
      });
    }
  } catch (err) {
    console.log('final err', err);
    return res.status(500).json({
      success: 0,
      error: 'Database Connection Error',
      errorReturned: err,
    });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body.values;

    jwt.verify(email, process.env.JWT_KEY, async (err, decoded) => {
      if (err)
        return res.status(400).json({
          success: 0,
          error: 'Invalid Code',
        });
      console.log(decoded);

      const salt = bcrypt.genSaltSync(10);
      new_hashed_password = await bcrypt.hashSync(newPassword, salt);

      const sqlCheck = await Student.update(
        { student_password: new_hashed_password },
        { where: { student_email: email } }
      );
      if (sqlCheck == 0)
        return res.status(400).json({
          success: 0,
          error: 'Mail not registered',
        });

      return res.status(200).json({
        success: 1,
        error: '',
      });
    });
  } catch (err) {
    console.log('final err', err);
    return res.status(500).json({
      success: 0,
      error: 'Database Connection Error',
      errorReturned: err,
    });
  }
});

router.get('/enabled', verifyToken, async (req, res) => {
  try {
    const result = await User.findOne({
      where: { customer_id: 1 },
      attributes: ['customer_blogs', 'customer_affiliate'],
    });
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Could not fetch data',
    });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await Student.findOne({
      where: { student_id: req.user.student_id },
      attributes: [
        'student_first_name',
        'student_last_name',
        'student_profile_picture',
        'student_bio',
        'student_website_url',
        'student_linkedin_url',
        'student_facebook_url',
        'student_twitter_url',
        'student_github_url',
        'student_youtube_url',
      ],
    });
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to fetch data',
      errorReturned: error,
    });
  }
});

router.put('/profile', verifyToken, async (req, res) => {
  try {
    const values = JSON.parse(req.body.values);
    console.log(values);

    if (req.files && req.files.student_profile_picture) {
      const file = req.files.student_profile_picture;
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
          .then(async (response) => {
            console.log(response);
            values.student_profile_picture = 'url of profile';
            console.log(values);

            const result = await Student.update(values, {
              where: { student_id: req.user.student_id },
            });

            return res.status(200).json({
              success: 1,
              result,
            });
          })
          .catch((err) => {
            console.log(err);

            return res.status(400).json({
              success: 0,
              error: 'Unable to update profile',
              errorReturned: err,
            });
          });
        console.log('profile pic uploaded');
      });
    } else {
      const result = await Student.update(values, {
        where: { student_id: req.user.student_id },
      });

      return res.status(200).json({
        success: 1,
        result,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to update profile',
      errorReturned: error,
    });
  }
});

module.exports = router;
