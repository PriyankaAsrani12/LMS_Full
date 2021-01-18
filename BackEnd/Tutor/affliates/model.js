const { DataTypes, INTEGER, STRING, BOOLEAN } = require('sequelize');
const { db } = require('../../common/db/sql');

const Affliate = db.define('affiliate_table', {
  affiliate_id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customer_id: {
    type: INTEGER,
    // references: {
    //     model: 'customer_tables',
    //     key:'customer_id'
    // }
  },
  affiliate_name: {
    type: STRING,
    allowNull: false,
  },
  course_name: {
    type: STRING,
    // references: {
    //     model: 'session_tables',
    //     key:'session_name'
    // }
  },
  course_id: {
    type: INTEGER,
    // references: {
    //     model: 'session_tables',
    //     key:'course_id'
    // }
  },
  affiliate_brought_student_name: {
    type: STRING,
    allowNull: false,
  },
  affiliate_brought_student_id: {
    type: INTEGER,
    // references: {
    //     model: 'student_tables',
    //     key:'student_id'
    // }
  },
  affiliate_purchase_status: {
    type: BOOLEAN,
    defaultValue: 0,
  },
  affiliate_purchaed_amount: {
    type: INTEGER,
    allowNull: true,
  },
  affiliate_rewards_given: {
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
module.exports = Affliate;
