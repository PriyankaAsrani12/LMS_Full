const { db } = require("./connection");
const { DataTypes } = require("sequelize");

const qa = db.define("qa", {
  id: {
    type: DataTypes.STRING(2),
    primaryKey: true,
  },
  question: DataTypes.STRING(100),
  optiona: DataTypes.STRING(100),
  optionb: DataTypes.STRING(100),
  optionc: DataTypes.STRING(100),
  optiond: DataTypes.STRING(100),
  answer: DataTypes.STRING(100),
});

// db.sync();

module.exports = { db, qa };
