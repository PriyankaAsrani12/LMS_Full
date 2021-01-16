const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const { db } = require('../../common/db/sql');
const verifyToken = require('../middlewares/verifyToken');
const Cart = require('./model');
const Student = require('../loginSignUp/model');
const RazorpayModel = require('./RazorpayModel');
const Course = require('../courses/model');

router.use('/coupon', require('./coupon'));

router.get('/', verifyToken, async (req, res) => {
  try {
    const sql = `SELECT 
        s.session_id,
        s.session_name,
        s.session_description,
        s.session_fee,
        s.session_thumbnail,
        c.cart_item_status,
        c.cart_item_id
        FROM
        session_tables as s INNER JOIN cart_tables as c ON  c.session_id=s.session_id AND c.student_id=${req.user.student_id}
        `;
    const result = await db.query(sql, { type: db.QueryTypes.SELECT });
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to get items',
    });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { session_id, cart_item_status } = req.body.values;
    console.log(req.body.values);

    const isExist = await Cart.findOne({
      where: { student_id: req.user.student_id, session_id },
    });
    if (isExist) {
      //    Run update query
      const result = await Cart.update(
        { cart_item_status },
        { where: { student_id: req.user.student_id, session_id } }
      );

      console.log(result);
      return res.status(200).json({
        success: 1,
        result,
      });
    } else {
      //    run create query

      const result = await Cart.create({
        session_id,
        cart_item_status,
        student_id: req.user.student_id,
      });
      console.log(result);
      return res.status(200).json({
        success: 1,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to Post Data',
    });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        success: 0,
        error: 'Item id not provided',
      });
    const result = await Cart.destroy({
      where: { cart_item_id: req.params.id },
    });
    console.log(result);
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to Delete Data',
    });
  }
});

router.post('/razorpay', verifyToken, async (req, res) => {
  try {
    const { amount, sessions } = req.body.values;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });

    const StudentDetails = await Student.findOne({
      where: { student_id: req.user.student_id },
    });
    const name = `${StudentDetails.student_first_name} ${StudentDetails.student_last_name}`;
    const email = StudentDetails.student_email;
    const contact = StudentDetails.student_phone_number;

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `${name} ${amount}`,
      payment_capture: 1,
    };

    razorpay.orders.create(options, async (err, response) => {
      if (err) return res.status(400).send(JSON.stringify(err));

      const newOrder = await RazorpayModel.create({
        order_id: response.id,
        student_id: req.user.student_id,
        customer_id: '1',
        amount_paid: response.amount_paid,
        razorpay_id: response.id,
        currency: response.currency,
        receipt: response.receipt,
        status: response.status,
      });

      sessions.forEach(async (doc) => {
        const purchaseTableRecord = await Course.create({
          student_id: req.user.student_id,
          customer_id: '1',
          session_id: doc.session_id,
          purchase_razorpay_order_id: response.id,
          purchase_razorpay_payment_amount: doc.session_fee,
          purchase_razorpay_payment_date: Date.now(),
        });
        console.log(purchaseTableRecord);
      });

      console.log(response);

      console.log(newOrder);

      res.status(200).json({
        success: 1,
        data: {
          id: response.id,
          currency: response.currency,
          amount: response.amount,
          name,
          email,
          contact,
        },
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to Proceed',
    });
  }
});

router.post('/verification', async (req, res) => {
  const SECRET = process.env.WEBHOOK_SECRET;
  const shasum = crypto.createHmac('sha256', SECRET);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    console.log('request is valid!!');
    const entity = req.body.payload.payment.entity;

    const updatedPaymentRecord = await RazorpayModel.update(
      {
        status: entity.status,
        payment_id: entity.id,
        paid_using_email: entity.email,
        paid_using_contact: entity.contact,
      },
      { where: { order_id: entity.order_id } }
    );

    console.log(updatedPaymentRecord);

    const result = await Cart.update(
      { cart_item_status: 'purchased' },
      {
        where: { cart_item_status: 'cart' },
      }
    );

    result.forEach(async (doc) => {
      const update = await Course.update(
        {
          purchase_razorpay_payment_id: entity.id,
          purchase_razorpay_payment_email: entity.email,
          purchase_razorpay_payment_contact: entity.contact,
          purchase_razorpay_payment_status: entity.status == 'captured' ? 1 : 0,
        },
        { where: { session_id: doc.session_id } }
      );
      console.log(update);
    });
  } else console.log('request is invalid');

  res.json({ status: 'ok' }); //this line is compulsory for razorpay
});

module.exports = router;
