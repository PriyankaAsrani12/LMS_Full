const { db } = require('../../common/db/sql');
const { DataTypes } = require('sequelize');

const ShortUrl = db.define('short_url', {
  link_id: {
    type: DataTypes.INTEGER(255),
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER(255),
    allowNull: false,
  },
  link_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link_long_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link_short_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link_unique_visits: {
    type: DataTypes.INTEGER(255),
    defaultValue: 0,
  },
  link_average_session_duration: {
    type: DataTypes.INTEGER(255),
    defaultValue: 0,
  },
  link_bounce_rates: {
    type: DataTypes.INTEGER(255),
    defaultValue: 0,
  },

  link_last_30_min_visitors: {
    type: DataTypes.INTEGER(255),
    defaultValue: 0,
  },
  link_last_24_hr_visitors: {
    type: DataTypes.INTEGER(255),
    defaultValue: 0,
  },
  link_country_name: {
    type: DataTypes.STRING,
    defaultValue: 'No Data Yet',
  },
  link_city_name: {
    type: DataTypes.STRING,
    defaultValue: 'No Data Yet',
  },
  link_distinct_country_visitors: {
    type: DataTypes.STRING,
    defaultValue: 'No Data Yet',
  },
  link_device_type_visitors: {
    type: DataTypes.STRING,
    defaultValue: 'No Data Yet',
  },

  // short: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  //   primaryKey:true,
  // },
  // linkName: {
  //   type: DataTypes.STRING,
  //   allowNull:true
  // },
  // full: {
  //   type: DataTypes.STRING,
  //   allowNull:false
  // }
});

db.sync();
module.exports = { db, ShortUrl };

/*
const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true,
    default: shortId.generate
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  }
})

module.exports = mongoose.model('ShortUrl', shortUrlSchema)
*/
