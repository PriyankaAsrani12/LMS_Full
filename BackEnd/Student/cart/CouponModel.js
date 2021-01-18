const { DataTypes, INTEGER, STRING, BOOLEAN } = require('sequelize');
const { db } = require('../../common/db/sql');

const CouponModel = db.define('coupon_table', {
  promocode_id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: INTEGER,
    // references: {
    //   model: 'customer_tables',
    //   key:'customer_id'
    // }
  },
  promocode_name: {
    type: STRING,
    allowNull: false,
  },
  promocode_discount_type: {
    type: STRING,
    allowNull: false,
  },
  promocode_discount_value: {
    type: INTEGER,
    allowNull: false,
  },
  promocode_available_session_ids: {
    type: STRING,
    // references: {
    //   model: 'session_tables',
    //   key:'session_id'
    // }
  },
  promocode_status: {
    type: BOOLEAN,
    allowNull: true,
  },
  promocode_start_date: {
    type: STRING,
    allowNull: true,
  },
  promocode_end_date: {
    type: STRING,
    allowNull: true,
  },
  promocode_condition: {
    type: INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE(6),
    defaultValue: new Date().getTime(),
  },

  modified_at: {
    type: DataTypes.DATE(6),
    defaultValue: new Date().getTime(),
  },
});

db.sync();
module.exports = CouponModel;
