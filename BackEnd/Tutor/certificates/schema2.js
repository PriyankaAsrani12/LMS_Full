// const mongoose = require("mongoose");
const { DataTypes } = require('sequelize');

// const template2 = new mongoose.Schema({
//   temp: { type: JSON, required: true },
// });

// exports = module.exports = mongoose.model("template2", template2);

const { db } = require('../../common/db/sql');

const Template = db.define('certificates', {
  certificate_id: {
    type: DataTypes.INTEGER(255),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // references: {
    //   model: 'customer_tables',
    //   key: 'customer_id',
    // },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  doctemp: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  operations: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

db.sync();

module.exports = Template;
