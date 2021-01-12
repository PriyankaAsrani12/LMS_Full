var http = require('http');
var urlencode = require('urlencode');
var request=require('request')
var http = require("https");



async function sendsms (toNumber,msg){

        // // Method chaining
// const textlocal = new Textlocal({ apikey: 'my-api-key' });
// textlocal.setFormat('xml').setSender('MrMaximus').sendSMS(message, numbers, optionalParams);
   
//     const TEXT_LOCAL_HOST = 'https://api.textlocal.in/send/';
//     const TEXT_LOCAL_API_KEY = process.env.TEXT_LOCAL_API_KEY ||'';//YOUR_TEXT_LOCAL_API_KEY
//     const TEXT_LOCAL_USERNAME = process.env.TEXT_LOCAL_USERNAME || '';//TEXT_LOCAL_USERNAME
//     const TEXT_LOCAL_SENDER =  process.env.TEXT_LOCAL_SENDER ||'';//BASIC SENDER ID (REPLACE IT WITH YOUR SENDER ID LATER)
//     var MSG_TEMPLATE = "TEXTLOCAL"
    
//     async function sendTextLocalSMS(mobileNumber, MSG_TEMPLATE) {
//         console.log('in program')
//         let options = {

//             'apikey': TEXT_LOCAL_API_KEY,
//             'message': MSG_TEMPLATE,
//             'sender': TEXT_LOCAL_SENDER,
//             'numbers': mobileNumber
//         }
//         return new Promise((resolve, reject) => {
//             request.post({ url: TEXT_LOCAL_HOST, form: options }, (error, response, body) => {
//                 if (error) {
//                     return reject(error);
//                 }
//                  resolve({ response, body });
//             })
//         })
//     };
//     console.log('out of program')
//    var response= await sendTextLocalSMS('8806920352', `Dear asd,
//     Your registration for Web-Development has been recorded successfully. Complete your payment on the link below to confirm your registration.
//      https://portal.oyesters.in/registration_WebDev/payment/ 
//     Regards,
//     Oyesters Training`);
//     console.log(response)

      
        var data ="Dear%20Attendee%2C%0AWe%20have%20received%20payment%20of%20Rs%201%20against%20your%20purchase%20of%201%20seat%20for%20TextLocal.%0AThank%20you%20for%20registering%21%20Further%20details%20will%20be%20conveyed%20to%20you%20via%20Email%20and%20SMS%201%20day%20prior%20to%20the%20webinar.%0ARegards%2C%0AOyesters%20Training";
        var toNumber;
        var msg;
        
        var username = urlencode('info.oyesters@gmail.com');
        var hash = process.env.HASH_TEXTLOCAL; // The hash key could be found under Help->All Documentation->Your hash key. Alternatively you can use your Textlocal password in plain text.
        var sender = 'OYESTR';
        var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + data;
        console.log(data);
        var options = {
         host: 'api.textlocal.in', path: '/send?' + data
        };
        callback = function (response) {
         var str = '';//another chunk of data has been recieved, so append it to `str`
         response.on('data', function (chunk) {
           str += chunk;
         });//the whole response has been recieved, so we just print it out here
         response.on('end', function () {
           console.log('response on end from sendsms',str);
         });
        }//console.log('hello js'))
        http.request(options, callback).end();//url encode instalation need to use $ npm install urlencode
        
        }
        // var response1=sendsms('9764010025', `Dear Attendee,
        // We have received payment of {{amount}} against your purchase of 1 seat for {{course}}.
        // Thank you for registering! Further details will be conveyed to you via Email and SMS 1 day prior to the webinar.
        // Regards,
        // Oyesters Training`)
        // console.log(response1)

module.exports.sendsms = sendsms;