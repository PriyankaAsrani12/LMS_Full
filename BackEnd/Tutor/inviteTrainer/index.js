const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/deepakAuth');
const { InviteTrainer } = require('./model');
const { sendInvitationMail } = require('../../common/emails/account');
const {
  sendsms,
} = require('../../common/completed_test_modules/sendSmsModule');

const validateData = (data) => {
  const arr = Object.keys(data).map((key) => key);
  arr.forEach((elem) => {
    if (!elem) return { success: 0, error: `provide ${elem} value` };
  });
  return { success: 1 };
};

router.get('/', auth, async (req, res) => {
  try {
    let tutors = await InviteTrainer.findAll({
      where: { customer_id: req.user.customer_id },
    });
    console.log(tutors);
    if (!tutors)
      return res.status(400).json({
        success: 0,
        error: 'unable to find trainers',
      });
    tutors = tutors.map((doc) => ({
      name: `${doc.invited_user_first_name} ${doc.invited_user_last_name}`,
      role: doc.invited_user_role,
      email: doc.invited_user_email,
      invite: doc.invited_user_status ? 'Accepted' : 'Pending',
    }));
    return res.status(200).json({
      success: 1,
      tutors,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'unable to find trainers',
    });
  }
});

router.post('/invite', auth, async (req, res) => {
  try {
    const {
      invited_user_first_name,
      invited_user_last_name,
      invited_user_role,
      invited_user_email,
    } = req.body.values;
    const validate = validateData(req.body.values);
    if (!validate.success)
      return res.status(400).json({
        success: 0,
        error: validate.error,
      });
    try {
      try {
        const trainer = InviteTrainer.create({
          customer_id: req.user.customer_id,
          invited_user_first_name,
          invited_user_last_name,
          invited_user_role,
          invited_user_email,
        });
        if (!trainer)
          return res.status(400).json({
            success: 0,
            error: 'unable to save data to database',
          });
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          success: 0,
          error: 'unable to save data to database',
          errorReturned: JSON.stringify(error),
        });
      }
      const customer_id = req.user.customer_id;

      const mailSent = sendInvitationMail(
        invited_user_first_name,
        invited_user_last_name,
        invited_user_role,
        invited_user_email,
        customer_id
      );
      if (!mailSent)
        return res.status(400).json({
          success: 0,
          error: 'unable to send mail',
        });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        success: 0,
        error: 'unable to send mail',
      });
    }

    return res.status(200).json({
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: 0,
      error: 'unable to send mail',
    });
  }
});

router.post('/', async (req, res) => {
  try {
    let {
      customer_first_name,
      customer_email,
      customer_phone_number,
      customer_last_name,
      customer_password,
      invited_user_role,
      customer_id,
    } = req.body.values;

    const sqlCheck = await InviteTrainer.findOne({
      where: {
        invited_user_email: customer_email,
        invited_user_status: 1,
      },
    });
    if (sqlCheck)
      return res.status(400).json({
        success: 0,
        error: 'you are already registered',
      });

    const validate = validateData(req.body.values);
    if (!validate.success)
      return res.status(400).json({
        success: 0,
        error: validate.error,
      });
    const salt = bcrypt.genSaltSync(10);
    customer_password = bcrypt.hashSync(customer_password, salt);

    const savedTrainer = await InviteTrainer.update(
      {
        // customer_id,
        // invited_user_first_name:customer_first_name,
        // invited_user_last_name:customer_last_name,
        // invited_user_role,
        // invited_user_email: customer_email,
        invited_user_phone_number: customer_phone_number,
        invited_user_password: customer_password,
        invited_user_status: 1,
      },
      {
        where: {
          customer_id,
          invited_user_email: customer_email,
        },
      }
    );
    if (!savedTrainer)
      return res.status(400).json({
        success: 0,
        error: 'unable to save data',
      });

    const mailSent = await sendInvitationMail(
      customer_first_name,
      customer_last_name,
      invited_user_role,
      customer_email
    );
    if (!mailSent)
      return res.status(400).json({
        success: 0,
        error: 'unable to send mail',
      });
    const smssent = await sendsms(customer_phone_number, 'test');
    console.log(smssent);
    res.redirect(307, '/invite/trainer/login');
    // return res.status(200).json({
    //     success:1
    // })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'unable to invite user',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('login route', req.body);

    const { customer_email, customer_password } = req.body.values;
    if (!customer_email)
      return res.status(400).json({
        success: 0,
        error: 'email not provided',
      });
    if (!customer_password)
      return res.status(400).json({
        success: 0,
        error: 'password not provided',
      });

    const result = await InviteTrainer.findOne({
      where: { invited_user_email: customer_email },
    });
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'email does not exists',
      });

    let storedPassword = result.dataValues.invited_user_password;
    const matchPassword = bcrypt.compareSync(customer_password, storedPassword);

    if (!matchPassword) {
      return res.status(200).json({
        success: 0,
        error: 'Incorrect Password',
      });
    }

    const jwtToken = jwt.sign(
      { temporaryResult: { customer_id: result.dataValues.invited_user_id } },
      process.env.JWT_KEY,
      {
        expiresIn: '1h',
      }
    );

    return res.status(200).json({
      success: 1,
      message: 'Login Successful',
      user: result.dataValues,
      token: jwtToken,
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

router.post('/delete', auth, async (req, res) => {
  try {
    console.log(req.body);
    const result = await InviteTrainer.destroy({
      where: {
        customer_id: req.user.customer_id,
        invited_user_email: req.body.values.invited_user_email,
      },
    });
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'unable to delete tutor',
      });
    return res.status(200).json({
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'unable to delete user',
      errorReturned: JSON.stringify(err),
    });
  }
});

module.exports = router;
