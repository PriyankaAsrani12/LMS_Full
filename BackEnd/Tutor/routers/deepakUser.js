const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/deepakAuth');

//Connecting to Database
const connection = require('../db/sql');

//Just for testing if token is working or not
router.get('/users', auth, (req, res) => {
  res.send('dvsd');
});

//Create a new User
router.post('/users', async (req, res) => {
  console.log(req.body);
  try {
    let {
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_password,
      customer_phone_number,
    } = req.body.values;

    //Checking if email is already Registered or not
    let sqlCheck = `SELECT * FROM CUSTOMER_TABLE WHERE CUSTOMER_EMAIL='${customer_email}'`;
    await connection.query(sqlCheck, async (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length != 0) {
        return res.status(500).json({
          success: 0,
          error: 'Email Already Registered',
        });
      } else {
        const salt = bcrypt.genSaltSync(10);
        customer_password = await bcrypt.hashSync(customer_password, salt);

        let sql = `INSERT INTO CUSTOMER_TABLE(CUSTOMER_FIRST_NAME,CUSTOMER_LAST_NAME,CUSTOMER_EMAIL,CUSTOMER_PASSWORD,CUSTOMER_PHONE_NUMBER) VALUES('${customer_first_name}','${customer_last_name}','${customer_email}','${customer_password}','${customer_phone_number}')`;

        let query = await connection.query(sql, (err, result) => {
          if (err) {
            throw err;
          }
          console.log('RAN successfully');

          return res.status(200).json({
            success: 1,
            message: 'User Successfully Created',
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'Database connection error',
      errorReturned: err,
    });
  }
});

router.post('/users/login', async (req, res) => {
  console.log(req.body);

  try {
    const { customer_email, customer_password } = req.body.values;

    let sql = `SELECT * FROM CUSTOMER_TABLE WHERE CUSTOMER_EMAIL = '${customer_email}'`;

    let query = await connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      console.log('RAN successfully');

      if (result.length == 0) {
        return res.status(200).json({
          success: 0,
          error: 'Email not registered',
        });
      }

      console.log(result);

      //Match Password
      const matchPassword = bcrypt.compareSync(
        customer_password,
        result[0].customer_password
      );

      if (!matchPassword) {
        return res.status(200).json({
          success: 0,
          error: 'Incorrect Email or Password',
        });
      }

      result[0].customer_password = '@nothingis%#passowrd&sothis1245isawesome';

      const jwtToken = jwt.sign(
        { temporaryResult: result },
        process.env.JWT_KEY,
        {
          expiresIn: '1h',
        }
      );

      return res.status(200).json({
        success: 1,
        message: 'Login Successful',
        user: result[0],
        token: jwtToken,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'Database connection error',
      errorReturned: err,
    });
  }
});

module.exports = router;
