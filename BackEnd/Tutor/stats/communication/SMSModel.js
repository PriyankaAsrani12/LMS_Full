const { STRING, BOOLEAN, INTEGER } = require('sequelize');
const { db } = require('../../../common/db/sql');

const SMSModel = db.define('sms_table', {
  send_sms_id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: INTEGER,
    // references: {
    //     model: 'customer_tables',
    //     model:'customer_id'
    // }
  },
  send_sms_to: {
    type: STRING,
    allowNull: false,
  },
  send_sms_body: {
    type: STRING,
    allowNull: false,
  },
  send_sms_date: {
    type: STRING,
    allowNull: false,
  },
  send_sms_time: {
    type: STRING,
    allowNull: false,
  },
  send_sms_confimation: {
    type: BOOLEAN,
    defaultValue: 0,
  },
});

db.sync();
module.exports = SMSModel;
