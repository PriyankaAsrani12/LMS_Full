const { db } = require('../../common/db/sql');
const { INTEGER, STRING, BOOLEAN } = require('sequelize');

const Course = db.define('student_purchase', {
  purchase_id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: INTEGER,
    // references: {
    //   model: 'student_table',
    //   key: 'student_id',
    // },
  },
  customer_id: {
    type: INTEGER,
    // references: {
    //   model: 'customer_table',
    //   key: 'customer_id',
    // },
  },
  session_id: {
    type: INTEGER,
    // references: {
    //   model: 'session_table',
    //   key: 'session_id',
    // },
  },
  purchase_razorpay_payment_id: {
    type: STRING,
    allowNull: true,
  },
  purchase_razorpay_order_id: {
    type: STRING,
    allowNull: false,
  },
  purchase_razorpay_payment_amount: {
    type: STRING,
    allowNull: false,
  },
  purchase_razorpay_payment_date: {
    type: STRING,
    allowNull: false,
  },
  purchase_razorpay_payment_time: {
    type: STRING,
    allowNull: true,
  },
  purchase_razorpay_payment_email: {
    type: STRING,
    allowNull: true,
  },
  purchase_razorpay_payment_contact: {
    type: STRING,
    allowNull: true,
  },
  purchase_razorpay_payment_status: {
    type: BOOLEAN,
    defaultValue: 0,
  },
});

db.sync();
module.exports = Course;
