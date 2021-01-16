const { DataTypes } = require('sequelize');
const { db } = require('../../common/db/sql');

const CouponModel = db.define('coupon_table', {
  coupon_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    // references: {
    //     model: 'customer_tables',
    //     key:'customer_id'
    // }
  },
  session_id: {
    type: DataTypes.INTEGER,
    // references: {
    //     model: 'session_tables',
    //     key:'session_id'
    // }
  },
  coupon_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coupon_code_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

db.sync();
module.exports = CouponModel;
