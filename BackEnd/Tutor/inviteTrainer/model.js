const { db } = require('../../common/db/sql');
const { DataTypes, INTEGER, STRING, BOOLEAN } = require('sequelize');

const InviteTrainer = db.define('invited_user', {
  invited_user_id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customer_id: {
    type: INTEGER,
    allowNull: false,
    references: {
      model: 'customer_table',
      key: 'customer_id',
    },
  },
  invited_user_first_name: {
    type: STRING,
    allowNull: false,
  },
  invited_user_last_name: {
    type: STRING,
    allowNull: false,
  },
  invited_user_role: {
    type: STRING,
    allowNull: false,
  },
  invited_user_email: {
    type: STRING,
    allowNull: false,
  },
  invited_user_phone_number: {
    type: STRING,
    allowNull: true,
  },
  invited_user_password: {
    type: STRING,
    allowNull: true,
  },
  invited_user_status: {
    type: BOOLEAN,
    defaultValue: 0,
  },
});

db.sync();
module.exports = { db, InviteTrainer };
