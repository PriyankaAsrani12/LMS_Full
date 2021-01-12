const { INTEGER, STRING, TEXT } = require('sequelize');
const { db } = require('../../common/db/sql');

const Blog = db.define('blog_table', {
  blog_id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  customer_id: {
    type: INTEGER,
    references: {
      model: 'customer_table',
      key: 'customer_id',
    },
  },
  student_id: {
    type: INTEGER,
    references: {
      model: 'student_table',
      key: 'student_id',
    },
  },
  blog_writer_name: {
    type: STRING,
    allowNull: false,
  },
  blog_writer_email: {
    type: STRING,
    allowNull: false,
  },
  blog_title: {
    type: TEXT('long'),
    allowNull: false,
  },
  blog_thumbnail: {
    type: STRING,
    allowNull: false,
  },
  blog_body: {
    type: TEXT('long'),
    allowNull: false,
  },
});

db.sync();
module.exports = Blog;
