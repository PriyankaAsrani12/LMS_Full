const { db } = require('../../common/db/sql');
const { DataTypes } = require('sequelize');

const Communication = db.define('communication_table', {
  communication_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customer_tables',
      key: 'customer_id',
    },
  },
  session_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'session_tables',
      key: 'session_id',
    },
  },
  communication_email: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  communication_email_days: {
    type: DataTypes.INTEGER,
    defaultValue: 999,
  },
  communication_message: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  communication_message_days: {
    type: DataTypes.INTEGER,
    defaultValue: 999,
  },
  communication_message_body:{
    type:DataTypes.TEXT("long"),
    allowNull:false
  },
  communication_email_body:{
    type:DataTypes.TEXT("long"),
    allowNull:false
  }
});

db.sync();

module.exports = Communication;
