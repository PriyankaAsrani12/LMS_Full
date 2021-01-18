const { db } = require('../../common/db/sql');
const { DataTypes, INTEGER, STRING } = require('sequelize');

const RazorpayModel = db.define('payment_data', {
  payment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  purchase_id: {
    type: INTEGER,
    // references: {
    //   model: 'purchase_tables',
    //   key:'purchase_id'
    // }
  },
  customer_id: {
    type: INTEGER,
    // references: {
    //   model: 'customer_tables',
    //   key:'customer_id'
    // }
  },
  razorpay_payment_id: {
    type: STRING,
    allowNull: false,
  },
  razorpay_order_id: {
    type: STRING,
    allowNull: false,
  },
  razorpay_entity: {
    type: STRING,
    allowNull: false,
  },
  razorpay_amount: {
    type: STRING,
    allowNull: false,
  },
  razorpay_currency: {
    type: STRING,
    allowNull: false,
  },
  razorpay_status: {
    type: STRING,
    allowNull: false,
  },
  razorpay_invoice_id: {
    type: STRING,
    allowNull: false,
  },
  razorpay_invoice_url: {
    type: STRING,
    allowNull: false,
  },
  razorpay_international: {
    type: STRING,
    allowNull: false,
  },
  razorpay_method: {
    type: STRING,
    allowNull: false,
  },
  razorpay_amount_refunded: {
    type: STRING,
    allowNull: false,
  },
  razorpay_captured: {
    type: STRING,
    allowNull: false,
  },
  razorpay_email: {
    type: STRING,
    allowNull: false,
  },
  razorpay_contact: {
    type: STRING,
    allowNull: false,
  },
  razorpay_refund_status: {
    type: STRING,
    allowNull: true,
  },
  razorpay_error_code: {
    type: STRING,
    allowNull: true,
  },
  razorpay_error_description: {
    type: STRING,
    allowNull: true,
  },
  razorpay_error_source: {
    type: STRING,
    allowNull: true,
  },
  razorpay_error_step: {
    type: STRING,
    allowNull: true,
  },
  razorpay_error_reason: {
    type: STRING,
    allowNull: true,
  },

  razorpay_created_at: {
    type: STRING,
    allowNull: false,
  },
  razorpay_updated_at: {
    type: STRING,
    allowNull: false,
  },
});

db.sync();
module.exports = RazorpayModel;
