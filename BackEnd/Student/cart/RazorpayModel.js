const { db } = require('../../common/db/sql');
const { DataTypes, INTEGER, STRING } = require('sequelize');

const RazorpayModel = db.define('payment_data', {
  id: {
    type: DataTypes.INTEGER(255),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  student_id: { type: INTEGER, allowNull: false },
  customer_id: {
    type: INTEGER,
    // references: {
    //     model: 'customer_table',
    //     key:'customer_id'
    // },
  },
  amount_paid: {
    type: INTEGER,
    allowNull: false,
  },
  order_id: {
    type: STRING,
    allowNull: false,
  },

  currency: {
    type: STRING,
    allowNull: false,
  },
  receipt: {
    type: STRING,
    allowNull: false,
  },
  status: {
    type: STRING,
    allowNull: false,
  },
  paid_using_email: {
    type: STRING,
    allowNull: true,
  },
  paid_using_contact: {
    type: STRING,
    allowNull: true,
  },
  payment_id: {
    type: STRING,
    allowNull: true,
  },
});

db.sync();
module.exports = RazorpayModel;

// id: 'order_GPw0R5RFIDsYnW',
//   entity: 'order',
//   amount: 20000,
//   amount_paid: 0,
//   amount_due: 20000,
//   currency: 'INR',
//   receipt: 'test test 200',
//   offer_id: null,
//   status: 'created',
//   attempts: 0,
//   notes: [],
//   created_at: 1610790565
