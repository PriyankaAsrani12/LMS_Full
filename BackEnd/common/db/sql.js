const sequelize = require('sequelize');

const db = new sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_user,
  process.env.MYSQL_ROOT_PASSWORD,
  {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    dialectOptions: {
      // useUTC: true, //for reading from database
      dateStrings: true,
      typeCast: true,
      timezone: '+05:30',
    },
    timezone: '+05:30', //for writing to database
    operatorsAliases: false,
  }
);

db.authenticate()
  .then(() => {
    console.log('database connected successfully');
  })
  .catch((e) => {
    console.log('ERROR DATABASE NOT CONNECTED');
  });

module.exports = { db };
