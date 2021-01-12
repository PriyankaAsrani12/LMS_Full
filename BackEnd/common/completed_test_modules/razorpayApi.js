// mention this in the any route  and  properly associate the keys

var params=req.body;
        var payment_id=params.payment_id||'WEB-DEV';
        var amount=params.amount||'1';
        var currency=params.currency||'INR';
        var razor_pay_api_key =''
        var YOUR_KEY_SECRET= ''
        var payment_id=''
        
        

request({
  method: 'POST',
  url: `https://${razor_pay_api_key}:${YOUR_KEY_SECRET}@api.razorpay.com/v1/payments/${payment_id}/capture`,
  form: {
    amount,
    currency
  }
}, function (error, response, body) {
  console.log('Status:', response.statusCode);
  console.log('Headers:', JSON.stringify(response.headers));
  console.log('Response:', body);
});
