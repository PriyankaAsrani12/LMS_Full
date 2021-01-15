const router = require('express').Router();
const { User } = require('../loginSignup/customer/models');
const auth = require('../middleware/deepakAuth');
const { db } = require('../../common/db/sql');
const Communication = require('./model');

router.get('/mail', auth, async (req, res) => {
  try {
    const result = await User.findOne({
      where: { customer_id: req.user.customer_id },
      attributes: [
        'communication_email_on_purchase',
        'communication_email_signup',
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
      errorReturned: JSON.stringify(error),
    });
  }
});

router.get('/message', auth, async (req, res) => {
  try {
    const result = await User.findOne({
      where: { customer_id: req.user.customer_id },
      attributes: [
        'communication_message_signup',
        'communication_message_purchase',
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
      errorReturned: JSON.stringify(error),
    });
  }
});

router.get('/session', auth, async (req, res) => {
  try {
    const sql = `SELECT 
    s.session_id,
    s.session_name,
    c.communication_email,
    c.communication_email_days
    FROM session_tables as s INNER JOIN communication_tables as c ON s.session_id=c.session_id `;
    const result = await db.query(sql, { type: db.QueryTypes.SELECT });
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to fetch data',
    });
  }
});

router.get('/directmessage', auth, async (req, res) => {
  try {
    const sql = `SELECT 
    s.session_id,
    s.session_name,
    c.communication_message,
    c.communication_message_days
    FROM session_tables as s INNER JOIN communication_tables as c ON s.session_id=c.session_id `;
    const result = await db.query(sql, { type: db.QueryTypes.SELECT });
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to fetch data',
    });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const { field, value = false } = req.body.values;
    console.log(field, value);

    if (!field)
      return res.status(400).json({
        success: 0,
        error: 'Data Incomplete',
      });
    const result = User.update(
      {
        [field]: value,
      },
      {
        where: {
          customer_id: req.user.customer_id,
        },
      }
    );
    console.log(result);
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'Failed to update data',
      });
    return res.status(200).json({
      success: 1,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to update data',
    });
  }
});

router.put('/toggle', auth, async (req, res) => {
  try {
    const values = req.body.values;

    const result = Communication.update(values, {
      where: {
        session_id: values.session_id,
      },
    });
    console.log(result);
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'Failed to update data',
      });
    return res.status(200).json({
      success: 1,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to update data',
    });
  }
});

router.put('/mail/changePeriod', auth, async (req, res) => {
  try {
    const values = req.body.values;
    console.log(values);
    const result = await Communication.update(values, {
      where: { session_id: values.session_id },
    });
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to update data',
    });
  }
});

// router.put('/toggle/message', auth, async (req, res) => {
//   try {
//     const { communication_message, session_id } = req.body.values;

//     const result = Communication.update(
//       {
//         communication_message,
//       },
//       {
//         where: {
//           session_id,
//         },
//       }
//     );
//     if (!result)
//       return res.status(400).json({
//         success: 0,
//         error: 'Failed to update data',
//       });
//     return res.status(200).json({
//       success: 1,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({
//       success: 0,
//       error: 'Unable to update data',
//     });
//   }
// });

module.exports = router;
