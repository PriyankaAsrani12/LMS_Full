const router=require("express").Router()
const Razorpay=require("razorpay");
const shortid=require("shortid")
const fs =require("fs")
let razorpay=new Razorpay({
    key_id:"rzp_test_VRw137IijSL6i7",
    key_secret:"IHUmnB2HrihuA602m4dQ4oAX"
})


router.post('/pay_item', async (req, res) => {
    const {price}=req.body;
    
	const payment_capture = 1
    
	const amount = price
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log(response)
		fs.writeFile("data.json", JSON.stringify(response), err => { 
     
			// Checking for errors 
			if (err) throw err;  
		   
			console.log("Done writing"); // Success 
		});
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
})

// router.post("/pay_item",async (req,res)=>{
//     const payment_capture=1;
//     const amount=499
//     const currency="INR"
//     try{
//         const response=razorpay.orders.create({
//             amount:amount*100,
//             currency:currency,
//             receipt:shortid.generate(),
//             payment_capture:payment_capture
//         });
    
//         console.log(response);
//         res.status(200).json(res.json({
//             id: response.id,
//             currency: response.currency,
//             amount: response.amount
//         }))
//     }
//     catch (e){
//         console.log(e);
//     }
// })

module.exports=router