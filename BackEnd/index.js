const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use(morgan('dev'));

//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/tutor', require('./Tutor/app'));
app.use('/student', require('./Student'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Listening to PORT ${PORT}...`));
