const http = require('https');
const crypto = require('crypto');

const sendWelcomeEmail = (email, name) => {
  var options = {
    method: 'POST',
    hostname: 'api.transmail.com',
    port: null,
    path: '/v1.1/email',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Zoho-enczapikey ${process.env.API_TRANSMAIL}`,
    },
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });
  console.log('==================================================');
  console.log(email, name);

  req.write(
    JSON.stringify({
      bounce_address: process.env.BOUNCE_MAIL,
      from: { address: process.env.SENDERS_MAIL, name: 'Oyesters Training' },
      to: [{ email_address: { address: email, name: name } }],
      subject: 'Test Email',
      htmlbody: `nice to have you here ${name}`,
    })
  );
  req.end();
  console.log('==============================================>');
};

const sendCancelationEmail = (email, name) => {
  var options = {
    method: 'POST',
    hostname: 'api.transmail.com',
    port: null,
    path: '/v1.1/email',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Zoho-enczapikey ${process.env.API_TRANSMAIL}`,
    },
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.write(
    JSON.stringify({
      bounce_address: process.env.BOUNCE_MAIL,
      from: { address: process.env.SENDERS_MAIL, name: 'Oyesters Training' },
      to: [{ email_address: { address: email, name: name } }],
      subject: 'goodbye',
      htmlbody: `hope, to see you soon!!!! ${name}`,
    })
  );
  req.end();
};

const sendPasswordResetEmail = (email, encryptedData) => {
  var options = {
    method: 'POST',
    hostname: 'api.transmail.com',
    port: null,
    path: '/v1.1/email',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Zoho-enczapikey ${process.env.API_TRANSMAIL}`,
    },
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });
  console.log('==================================================');
  console.log(email);

  req.write(
    JSON.stringify({
      bounce_address: process.env.BOUNCE_MAIL,
      from: { address: process.env.SENDERS_MAIL, name: 'Oyesters Training' },
      to: [{ email_address: { address: email } }],
      subject: 'Welcome!!!!!!',
      htmlbody: `nice to have you here ${email}
            <h2>Reset Your Password</h2>
            <a href="http://13.233.214.77:3000/Tutor/user/reset-password?oobCode=${encryptedData}">Reset</a>
  `,
    })
  );
  req.end();
  console.log('==============================================>');
};

const sendInvitationMail = (
  invited_user_first_name,
  invited_user_last_name,
  invited_user_role,
  invited_user_email,
  customer_id
) => {
  var options = {
    method: 'POST',
    hostname: 'api.transmail.com',
    port: null,
    path: '/v1.1/email',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Zoho-enczapikey ${process.env.API_TRANSMAIL}`,
    },
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });
  console.log('==================================================');

  req.write(
    JSON.stringify({
      bounce_address: process.env.BOUNCE_MAIL,
      from: { address: process.env.SENDERS_MAIL, name: 'Oyesters Training' },
      to: [{ email_address: { address: invited_user_email } }],
      subject: 'Invitation Mail',
      htmlbody: `You are invited as trainer
            <h2>Register Here</h2>
            <a href=\`http://13.233.214.77:3000/Tutor/user/register?email=${invited_user_email}&first_name=${invited_user_first_name}&last_name=${invited_user_last_name}&user_role=${invited_user_role}&customer_id=${customer_id}\`>Reset</a>
  `,
    })
  );
  req.end();
  console.log(
    'sent invitation mail==============================================>'
  );
  return 'MAIL sent Successfully ';
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
  sendPasswordResetEmail,
  sendInvitationMail,
};
