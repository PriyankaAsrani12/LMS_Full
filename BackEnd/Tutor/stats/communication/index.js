const router = require('express').Router();
const auth = require('../../middleware/deepakAuth');
const { db } = require('../../../common/db/sql');

router.get('/', auth, async (req, res) => {
  try {
    const sql1 = `SELECT 
        send_email_to,
        send_email_date,
        send_email_time,
        send_email_id,
          send_email_confimation
            
            FROM email_tables
            WHERE customer_id=${req.user.customer_id}
          `;

    const sql2 = `SELECT
        send_sms_id,
        send_sms_date,
        send_sms_time,
        send_sms_to,
        send_sms_confimation
        FROM sms_tables
        WHERE customer_id=${req.user.customer_id}
     
        `;
    const result1 = await db.query(sql1, { type: db.QueryTypes.SELECT });
    const result2 = await db.query(sql2, { type: db.QueryTypes.SELECT });

    console.log(result1, result2);

    return res.status(200).json({
      success: 1,
      emailData: result1,
      smsData: result2,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'unale to fetch data',
      errorReturned: JSON.stringify(error),
    });
  }
});

module.exports = router;
