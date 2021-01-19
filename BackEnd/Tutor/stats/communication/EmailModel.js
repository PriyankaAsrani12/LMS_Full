const { INTEGER, STRING, BOOLEAN } = require('sequelize');
const { db } = require('../../../common/db/sql');

const EmailModel = db.define('email_table', {
  send_email_id: {
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
  send_email_to: {
    type: STRING,
    allowNull: false,
  },
  send_email_body: {
    type: STRING,
    allowNull: false,
  },
  send_email_date: {
    type: STRING,
    allowNull: false,
  },
  send_email_time: {
    type: STRING,
    allowNull: false,
  },
  send_email_confimation: {
    type: BOOLEAN,
    defaultValue: 0,
  },
});

db.sync();
module.exports = EmailModel;
