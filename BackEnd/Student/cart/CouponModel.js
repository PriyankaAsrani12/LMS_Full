const { DataTypes, INTEGER, STRING, BOOLEAN } = require('sequelize');
const { db } = require('../../common/db/sql');

const CouponModel = db.define('couponcodes_table', {
  couponcode_id: {
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
  couponcode_name: {
    type: STRING,
    allowNull: false,
  },
  couponcode_discount_type: {
    type: STRING,
    allowNull: false,
  },
  couponcode_discount_value: {
    type: INTEGER,
    allowNull: false,
  },
  couponcode_available_session_ids: {
    type: STRING,
    // references: {
    //   model: 'session_tables',
    //   key:'session_id'
    // }
  },
  couponcode_status: {
    type: BOOLEAN,
    allowNull: true,
  },
  couponcode_start_date: {
    type: STRING,
    allowNull: true,
  },
  couponcode_end_date: {
    type: STRING,
    allowNull: true,
  },
  couponcode_condition: {
    type: INTEGER,
    allowNull: true,
  },
});

db.sync();
module.exports = CouponModel;
