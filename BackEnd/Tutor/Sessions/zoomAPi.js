const rp = require('request-promise')
const jwt = require('jsonwebtoken')

async function zoomApi(uri,method,token,qs,body){
		var options = {
					    uri,
					    qs,
					    method,
					    auth: {
					      //Provide your token here
					    		'bearer': token
					  	},
					    headers: {
					        'User-Agent': 'Zoom-Jwt-Request',
					        'content-type': 'application/json'
					    },
					    body,
					    json: true // Automatically parses the JSON string in the response
					};

					let data = await rp(options)
					    .then((response) => {
					      //logic for your response
					        console.log('🚀 User has', response);
					        return response;
						})
					    .catch(function (err) {
					        // API call failed...
					        console.log('🚀 API call failed, reason ', err);
					        return err;
						});
					
						// console.log('✅',data)
						return data;

}


					module.exports={
						zoomApi
					}


// router.post('ListMeetings',(req,res)=>{
// 	body=req.body
// 	uri=`https://api.zoom.us/v2/users/${body.email}/meetings`
// 	method='GET'
// 	token=`${req.user.zoomApiToken}`
// 	qs=body.qs
// 	body=body.body

// 	zoomApi(uri,method,token,qs,body,cb)
// });

// router.post('CreateMeetings',(req,res)=>{
// 	body=req.body
// 	uri=`https://api.zoom.us/v2/users/${body.email}/meetings`
// 	method='POST'
// 	token=`${req.user.zoomApiToken}`
// 	qs=body.qs
// 	body=body.body
	
// 	zoomApi(uri,method,token,qs,body,cb)
// });

// router.post('GetRecordings',(req,res)=>{
// 	body=req.body
// 	uri=`https://api.zoom.us/v2/meetings/${meetingId}/recordings`
// 	method='GET'
// 	token=`${req.user.zoomApiToken}`
// 	qs=body.qs
// 	body=body.body
	
// 	zoomApi(uri,method,token,qs,body,cb)
// });


// router.post('GetAllRecordings',(req,res)=>{
// 	body=req.body
// 	uri=`https://api.zoom.us/v2/users/${req.user.email}/recordings`
// 	method='GET'
// 	token=`${req.user.zoomApiToken}`
// 	qs=body.qs
// 	body=body.body
	
// 	zoomApi(uri,method,token,qs,body,cb)
// });