const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(fileUpload());
app.use(cookieParser());

app.use(morgan('dev'));

//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/tutor', require('./Tutor/app'));
app.use('/student', require('./Student'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Listening to PORT ${PORT}...`));
