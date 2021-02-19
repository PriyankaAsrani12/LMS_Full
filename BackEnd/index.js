const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('./common/db/sql');

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

require('./Tutor/loginSignup/customer/models');
require('./Tutor/Sessions/models');
require('./Tutor/Sessions/LibraryItems/recorded/chapter_table_model');
require('./Tutor/Sessions/LibraryItems/recorded/lesson_table_model');
require('./Student/loginSignUp/model');
require('./Student/referalLink/model');
require('./Tutor/Sessions/LibraryItems/model');

require('./Tutor/urlShorten/model');
require('./Student/courses/model');
require('./Student/cart/RazorpayModel');

require('./Tutor/Trainer/model');
require('./Tutor/inviteTrainer/model');
require('./Student/cart/CouponModel');

require('./Student/blog/model');
require('./Tutor/communication/model');
require('./Tutor/affliates/model');

require('./Tutor/stats/communication/EmailModel');
require('./Tutor/stats/communication/SMSModel');

//Bookmark table here

app.use('/tutor', require('./Tutor/app'));
app.use('/student', require('./Student'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Listening to PORT ${PORT}...`));
