const { User } = require('./models');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const webp = require('webp-converter');
const request = require('request');
const axios = require('axios').default;
require('json-circular-stringify');
const cmd = require('node-cmd');
const fetch = require('node-fetch');

const auth = require('../../middleware/deepakAuth');
const {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} = require('../../../common/emails/account');
const {
  sendsms,
} = require('../../../common/completed_test_modules/sendSmsModule');

router.get('/user', auth, async (req, res) => {
  const sqlCheck = await User.findOne({
    where: { customer_id: req.user.customer_id },
    attributes: [
      'customer_profile_picture',
      'customer_subdomain_name',
      'customer_institute_name',
      'customer_about_me',
      'customer_career_summary',
      'customer_experience',
      'customer_role',
      'customer_linkedin_url',
      'customer_occupation',
      'customer_facebook_url',
      'customer_website_url',
      'customer_twitter_url',
    ],
  });
  if (!sqlCheck)
    return res.status(400).json({
      success: 0,
      error: 'user does not exists',
    });
  return res.status(200).json({
    success: 1,
    user: sqlCheck.dataValues,
  });
});

//Create a new User
router.post('/users', async (req, res) => {
  // req.body.values.customer_subdomain_name = "Remove it"
  // req.body.values.customer_institute_name = "Deepak"
  console.log('❓', req.body.values);

  try {
    let {
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_password,
      customer_phone_number,
      customer_institute_name,
      customer_subdomain_name,
      customer_profile_picture,
      using_google = false,
    } = req.body.values;

    //Don't change it to let otherwise DB is will not connect
    sqlCheck = await User.findOne({
      where: {
        customer_email: customer_email,
      },
    });
    console.log('RAN SUCCESSFULLY');
    // console.log('❓',sqlCheck)

    if (sqlCheck) {
      return res.status(400).json({
        success: 0,
        error: 'Email Aready Registered',
      });
    }

    const isSubDomainExists = await User.findOne({
      where: { customer_subdomain_name },
    });
    if (isSubDomainExists)
      return res.status(400).json({
        success: 0,
        error: 'Subdomain Already Exists',
      });

    if (!using_google) {
      const salt = bcrypt.genSaltSync(10);
      customer_password = await bcrypt.hashSync(customer_password, salt);

      req.body.values.customer_password = customer_password;
    }
    //Change it to customer email and customer name
    let name = customer_first_name;
    if (customer_last_name)
      name = `${customer_first_name}-${customer_last_name}`;

    req.body.values.customer_cdn_url = 'oyesth-lms-12.b-cdn.net';

    const user = await User.create(req.body.values);

    let temp = await sendWelcomeEmail(customer_email, name);
    console.log('🚀', temp);

    // sending sms
    if (!using_google) {
      const result = await sendsms(customer_phone_number, 'test');
      console.log(result);
    }


    let vl_library_id=''
    let vl_access_id=''

    //create video library here
    const videoLibraryName = `oye-${customer_first_name}-${user.customer_id}`
    const url = 'https://api.bunny.net/videolibrary';

    // const vldata = {ReplicationRegions: ['NY'], Name: videoLibraryName}

    // const vlheaders = {
    //   Accept: 'application/json',
    //   'Content-Type': 'application/json',
    //   AccessKey: process.env.BUNNYCDN_ACCESS_KEY,
    // }

    // const vlresponse = await axios.post(
    //   vlurl,
    //   vldata,
    //   {vlheaders} 
    // );

    // console.log(vlresponse.data)
    // req.body.values.customer_stream_library_id = vlresponse.data.Id;
    // req.body.values.customer_stream_library_access_key = vlresponse.data.ApiKey;
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AccessKey: process.env.BUNNYCDN_ACCESS_KEY,
      },
      body: JSON.stringify({ReplicationRegions: ['NY'], Name: videoLibraryName})
    };

    fetch(url, options)
      .then(res => res.json())
      .then(json => 
        { 
          console.log(json);
          vl_library_id=json.Id;
          vl_access_id=json.ApiKey
        })
      .catch(err => console.error('error:' + err));


    
    req.body.values.customer_stream_library_id = vl_library_id;
    req.body.values.customer_stream_library_access_key = vl_access_id;

    //create storage zone ,pull zone here
    const storageZoneName = `oye-${customer_first_name}-${user.customer_id}`;

    const data = { Name: storageZoneName, Region: 'DE' };
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      AccessKey: process.env.BUNNYCDN_ACCESS_KEY,
    };

    const response = await axios.post(
      'https://bunnycdn.com/api/storagezone',
      data,
      {headers} 
    );

    const storageZoneId = response.data.Id;

    const pullZoneData = {
      Name: response.data.Name,
      Type: 1,
      StorageZoneId: response.data.Id,
      ZoneSecurityEnabled: true,
      EnableGeoZoneUS: false,
      EnableGeoZoneEU: false,
      EnableGeoZoneASIA: false,
      EnableGeoZoneAF: false,
      ZoneSecurityEnabled: true,
      EnableGeoZoneSA: false,
      AccessControlOriginHeaderExtensions: ['*'],
    };

    const pullZone = await axios.post(
      'https://bunnycdn.com/api/pullzone',
      pullZoneData,
       {headers} 
    );
    const pullZoneId = response.data.Id;

console.log("pull zone ",pullZone.data);
    req.body.values.customer_pull_zone_id = pullZoneId;
    req.body.values.customer_pull_zone_name = pullZone.data.Name;

    req.body.values.customer_storage_zone_id = storageZoneId;
    req.body.values.customer_storage_zone_name = storageZoneName;
    req.body.values.customer_storage_zone_password = response.data.Password;
    req.body.values.customer_pull_zone_hostname =
      pullZone.data.Hostnames[0].Value;
    req.body.values.customer_url_token_authentication_key =
      pullZone.data.ZoneSecurityKey;

    cmd.run(
      `
      bnycdn key -t storages set ${pullZone.data.Name} ${response.data.Password}
    `,
      async (err, data, stderr) => {
        if (err)
          return res.status(200).json({
            success: 0,
            error: err,
          });

        req.body.values.customer_storage_zone_user_key = data.substr(24);

        // run update query here
        const updates = await User.update(req.body.values, {
          where: { customer_id: user.customer_id },
        });
        console.log(updates);

        res.redirect(307, '/tutor/users/login');
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'Database connection error',
      errorReturned: err,
    });
  }
});

// sigin in a user
router.post('/users/login', async (req, res) => {
  console.log(req.body.values);

  try {
    const {
      customer_email,
      customer_password = '',
      using_google = false,
    } = req.body.values;

    sqlCheck = await User.findOne({
      where: {
        customer_email: customer_email,
      },
    });
    console.log('RAN SUCCESSFULLY');
    // console.log('❓',sqlCheck.dataValues)

    if (!sqlCheck) {
      return res.status(200).json({
        success: 0,
        error: 'Email not registered',
      });
    } else {
      if (!using_google){
        let storedPassword = sqlCheck.dataValues.customer_password;
        const matchPassword = bcrypt.compareSync(
          customer_password,
          storedPassword
        );

        if (!matchPassword) {
          return res.status(200).json({
            success: 0,
            error: 'Incorrect Email or Password',
          });
        }
      }

      const jwtToken = jwt.sign(
        { customer_id: sqlCheck.dataValues.customer_id },
        process.env.JWT_KEY,
        {
          expiresIn: '1h',
        }
      );

      res.cookie('auth-token', jwtToken, {
        httpOnly: true,
      });

      return res.status(200).json({
        success: 1,
        message: 'Login Successful',
        user: sqlCheck.dataValues,
        token: jwtToken,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'Database connection error',
      errorReturned: err,
    });
  }
});

// Handle Forgot password
router.post('/users/forgotPassword', async (req, res) => {
  try {
    const { email } = req.body.values;
    sqlCheck = await User.findOne({
      where: {
        customer_email: email,
      },
    });
    console.log('RAN SUCCESSFULLY');
    // console.log('❓',sqlCheck.dataValues)

    if (!sqlCheck) {
      console.log('email not found');
      return res.status(500).json({
        success: 0,
        error: 'Email not registered',
      });
    } else {
      console.log('success', sqlCheck.dataValues);

      //Change it to customer email and customer name

      const encryptedData = jwt.sign(
        { email, valid: Date.now() },
        process.env.JWT_KEY,
        {
          expiresIn: '1d',
        }
      );
      console.log(encryptedData);

      let temp = await sendPasswordResetEmail(email, encryptedData);
      console.log('🚀', temp);

      return res.status(200).json({
        success: 1,
        error: '',
      });
    }
  } catch (err) {
    console.log('final err', err);
    return res.status(500).json({
      success: 0,
      error: 'Database Connection Error',
      errorReturned: err,
    });
  }
});

// handle reset password
router.post('/users/reset-password', async (req, res) => {
  try {
    console.log(req.body);
    const { email, newPassword } = req.body.values;

    jwt.verify(email, process.env.JWT_KEY, async (err, decoded) => {
      if (err)
        return res.status(400).json({
          success: 0,
          error: 'Invalid Code',
        });
      console.log(decoded);

      const salt = bcrypt.genSaltSync(10);
      new_hashed_password = await bcrypt.hashSync(newPassword, salt);

      const sqlCheck = await User.update(
        { customer_password: new_hashed_password },
        { where: { customer_email: decoded.email } }
      );
      console.log('data values are', sqlCheck);
      if (sqlCheck == 0)
        return res.status(400).json({
          success: 0,
          error: 'Mail not registered',
        });

      return res.status(200).json({
        success: 1,
        error: '',
      });
    });
  } catch (err) {
    console.log('final err', err);
    return res.status(500).json({
      success: 0,
      error: 'Database Connection Error',
      errorReturned: err,
    });
  }
});

router.put('/users', auth, async (req, res) => {
  console.log(req.files);
  try {
    let flg = 0,
      profile_name = '';

    // console.log(req.files.profile_picture,JSON.parse(req.body.values))
    if (req.files && req.files.profile_picture) {
      const file = req.files.profile_picture;
      file.mv(`${process.env.FILE_UPLOAD_PATH_CLIENT}${file.name}`, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            error: 'could not upload profile picture',
          });
        }
        webp
          .cwebp(
            `${process.env.FILE_UPLOAD_PATH_CLIENT}${file.name}`,
            `${process.env.FILE_UPLOAD_PATH_CLIENT}${file.name.substr(
              0,
              file.name.lastIndexOf('.')
            )}.webp`,
            '-q 80'
          )
          .then(async (response) => {
            console.log(response);
            profile_name = `${file.name.substr(
              0,
              file.name.lastIndexOf('.')
            )}.webp`;

            try {
              const values = JSON.parse(req.body.values);

              if (!values.customer_subdomain_name)
                return res.status(400).json({
                  success: 0,
                  error: 'Subdomain not provided',
                });

              const isPresent = await User.findOne({
                where: {
                  customer_subdomain_name: values.customer_subdomain_name,
                  customer_id: { $not: req.user.customer_id },
                },
              });
              if (isPresent)
                return res.status(400).json({
                  success: 0,
                  error: 'Provided Subdomain Name Already Exists',
                });

              values.customer_profile_picture = profile_name;
              const updatedUser = await User.update(values, {
                where: { customer_id: req.user.customer_id },
              });
              return res.status(200).json({
                success: 1,
                user: updatedUser,
              });
            } catch (error) {
              console.log(error);
              return res.status(400).json({
                success: 0,
              });
            }
          })
          .catch((err) => console.log(err));
        console.log('profile picture updated');
      });
    } else {
      const {
        customer_subdomain_name,
        customer_institute_name,
        customer_about_me,
        customer_career_summary,
        customer_role,
        customer_linkedin_url,
        customer_occupation,
        customer_facebook_url,
        customer_website_url,
        customer_twitter_url,
        customer_experience,
      } = JSON.parse(req.body.values);
      console.log('here', customer_subdomain_name);

      if (!customer_subdomain_name)
        return res.status(400).json({
          success: 0,
          error: 'Subdomain not provided',
        });
      const user = await User.findOne({
        where: { customer_id: req.user.customer_id },
      });
      if (!user)
        return res.status(400).json({
          success: 0,
          error: 'user does not exists',
        });
      console.log(user.customer_subdomain_name);
      // const user = sqlCheck.dataValues;
      if (customer_subdomain_name != user.customer_subdomain_name) {
        const isPresent = await User.findOne({
          where: {
            customer_id: { $not: req.user.customer_id },
            customer_subdomain_name,
          },
        });
        if (isPresent)
          return res.status(400).json({
            success: 0,
            error: 'provided subdomain name already exists',
          });
      }
      console.log(user);
      if (profile_name) user.customer_profile_picture = profile_name;
      user.customer_subdomain_name = customer_subdomain_name;
      user.customer_institute_name = customer_institute_name;
      user.customer_about_me = customer_about_me;
      user.customer_career_summary = customer_career_summary;
      user.customer_role = customer_role;
      user.customer_linkedin_url = customer_linkedin_url;
      user.customer_occupation = customer_occupation;
      user.customer_facebook_url = customer_facebook_url;
      user.customer_website_url = customer_website_url;
      user.customer_twitter_url = customer_twitter_url;
      user.customer_experience = customer_experience;

      const updatedUser = await user.save();
      if (!updatedUser)
        return res.status(400).json({
          success: 0,
          error: 'unable to update user info',
        });
      res.status(200).json({
        success: 1,
        user: updatedUser,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: 0,
      error: 'can not update user details',
    });
  }
});

router.post('/user/payment/details', auth, async (req, res) => {
  try {
    console.log(req.body);
    const {
      customer_payment_full_name,
      customer_payment_bank_name,
      customer_payment_account_number,
      customer_payment_IFSC_code,
      customer_payment_bank_address,
    } = req.body.values;
    const user = User.findOne({ where: { customer_id: req.user.customer_id } });
    if (!user)
      return res.status(400).json({
        success: 0,
        error: 'user does not exists',
      });

    const updatedUser = await User.update(req.body.values, {
      where: { customer_id: req.user.customer_id },
    });
    console.log(updatedUser);

    // const updatedUser = await user.save();
    if (!updatedUser)
      return res.status(500).json({
        success: 0,
        error: 'could not upload data',
      });
    return res.status(200).json({
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'coould not update payment details',
    });
  }
});

router.get('/user/payment/details', auth, async (req, res) => {
  try {
    const paymentDetails = await User.findOne({
      where: { customer_id: req.user.customer_id },
      attributes: [
        'customer_payment_full_name',
        'customer_payment_bank_name',
        'customer_payment_account_number',
        'customer_payment_IFSC_code',
        'customer_payment_bank_address',
      ],
    });
    if (!paymentDetails)
      return res.status(400).json({
        success: 0,
        error: 'unable to fetch payment details',
      });
    return res.status(200).json({
      success: 1,
      paymentDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'database error',
    });
  }
});

router.get('/user/zoom/token', auth, async (req, res) => {
  try {
    const result = await User.findOne({
      where: { customer_id: req.user.customer_id },
      attributes: ['customer_zoom_email', 'customer_zoom_jwt_token'],
    });
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'unable to fetch zoom details',
      });
    return res.status(200).json({
      success: 1,
      customer_zoom_email: result.dataValues.customer_zoom_email,
      customer_zoom_jwt_token: result.dataValues.customer_zoom_jwt_token,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: 0,
      error: 'unable to fetch zoom details',
    });
  }
});

router.put('/user/zoom/token', auth, async (req, res) => {
  try {
    const { customer_zoom_email, customer_zoom_jwt_token } = req.body.values;
    const result = await User.update(
      {
        customer_zoom_email,
        customer_zoom_jwt_token,
      },
      {
        where: { customer_id: req.user.customer_id },
      }
    );
    console.log(result);
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'could not update details',
      });
    return res.status(200).json({
      success: 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: 0,
      error: 'could not update details',
    });
  }
});
// these 2 routes we don't need
// create a user registered via google auth
router.post('/users/google', async (req, res) => {
  // req.body.values.customer_subdomain_name = "Remove it"
  // req.body.values.customer_institute_name = "Deepak"
  console.log('❓', req.body.values);

  try {
    let {
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_institute_name,
      customer_subdomain_name,
      customer_profile_picture,
    } = req.body.values;
    //Don't change it to let otherwise DB is will not connect
    sqlCheck = await User.findOne({
      where: {
        customer_email: customer_email,
      },
    });
    console.log('RAN SUCCESSFULLY');
    // console.log('❓',sqlCheck)

    if (sqlCheck) {
      return res.json({
        success: 0,
        error: 'Email Aready Registered',
      });
    }

    // Change it to customer email and customer name
    let temp = await sendWelcomeEmail('deepaksharma290700@gmail.com', 'vedant');
    console.log('🚀', temp);

    const user = await User.create(req.body.values);

    //  res.status(200).json({
    //     success:1,
    //     message:"User Successfully Created"
    // });
    res.redirect(307, '/users/login/google');
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: 0,
      error: 'Database connection error',
      errorReturned: err,
    });
  }
});

// login user via google auth
router.post('/users/login/google', async (req, res) => {
  // console.log(req.body.values);

  try {
    const { customer_name, customer_email } = req.body.values;

    sqlCheck = await User.findOne({
      where: {
        customer_email: customer_email,
      },
    });
    console.log('RAN SUCCESSFULLY');
    // console.log('❓',sqlCheck.dataValues)

    if (!sqlCheck) {
      return res.status(200).json({
        success: 0,
        error: 'Email not registered',
      });
    } else {
      const jwtToken = jwt.sign(
        { temporaryResult: sqlCheck.dataValues },
        process.env.JWT_KEY,
        {
          expiresIn: '1h',
        }
      );

      return res.status(200).json({
        success: 1,
        message: 'Login Successful',
        user: sqlCheck.dataValues,
        token: jwtToken,
      });
    }
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
