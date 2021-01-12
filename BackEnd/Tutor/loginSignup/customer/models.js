const { db } = require('../../../common/db/sql');
const { DataTypes } = require('sequelize');

const User = db.define('customer_table', {
  customer_id: {
    type: DataTypes.INTEGER(255),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  customer_first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  customer_password: {
    type: DataTypes.STRING,
    // allowNull: false
    allowNull: true,
  },
  customer_phone_number: {
    type: DataTypes.INTEGER(15),
    // allowNull: false
    allowNull: true,
  },
  customer_institute_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_subdomain_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_career_summary: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  customer_role: {
    type: DataTypes.STRING,
    defaultValue: 'Admin',
  },
  customer_website_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_facebook_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_linkedin_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_twitter_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_occupation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_profile_picture: {
    type: DataTypes.STRING,
    defaultValue:
      'https://ga.berkeley.edu/wp-content/uploads/2015/08/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
  },
  customer_about_me: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  customer_short_introduction: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_skills: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_subscription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_facebook_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_facebook_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_linkedin_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_twitter_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  customer_phone_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  customer_zoom_jwt_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_zoom_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_payment_full_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_payment_bank_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_payment_account_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_payment_IFSC_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_payment_bank_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // customer_storage_zone_name: {
  //   type:DataTypes.STRING,
  //   allowNull:false
  // },
  // customer_pull_zone_name: {
  //   type:DataTypes.STRING,
  //   allowNull:false
  // },
  // customer_cdn_url: {
  //   type:DataTypes.STRING,
  //   allowNull:false
  // }
});

db.sync();

module.exports = { db, User };
