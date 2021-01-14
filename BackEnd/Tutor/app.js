/*const express = require('express')
const mysql = require('mysql')
const morgan = require('morgan')
const cors = require('cors');
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser');
// require('./db/mongoose')


//Routes
// const userRouter = require('./routers/user')
// const userRouter = require('./routers/deepakUser')
const sessionRouter = require('./routers/session')

const app = express()

app.use(cors());
app.use(fileUpload());
app.use(cookieParser());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});


app.use(morgan('dev'));

//Body Parser
app.use(express.urlencoded({extended : false}));
app.use(express.json());

*/
const userRouter = require('./loginSignup/customer/customer');

const router = require('express').Router();
router.use(userRouter);
router.use('/sessions', require('./Sessions/index'));
router.use('/themes', require('./server'));
router.use('/library', require('./library/routes/index'));
router.use('/shorturl', require('./urlShorten'));
router.use('/libraryItems', require('./Sessions/LibraryItems'));
router.use(
  '/libraryItems/recorded',
  require('./Sessions/LibraryItems/recorded')
);
router.use('/trainer', require('./Trainer'));
router.use('/invite/trainer', require('./inviteTrainer'));
router.use('/stats', require('./stats'));
router.use('/certificates', require('./certificates/server'));
router.use('/blog', require('./blog'));
module.exports = router;
