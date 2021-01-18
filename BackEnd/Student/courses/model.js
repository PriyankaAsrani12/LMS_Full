const { db } = require('../../common/db/sql');
const { DataTypes, INTEGER, STRING, BOOLEAN } = require('sequelize');

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
  purchase_type: {
    type: STRING,
    allowNull: false,
  },
  purchase_cupon_code_applied: {
    type: STRING,
    allowNull: false,
  },
  purchase_units_taken: {
    type: INTEGER,
  },
  purchased_for_email: {
    type: STRING,
    allowNull: false,
  },
  purchased_GSTIN_number: {
    type: STRING,
    allowNull: false,
  },
  purchase_amount: {
    type: STRING,
    allowNull: false,
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
module.exports = Course;
