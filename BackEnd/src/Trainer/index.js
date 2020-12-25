const router = require('express').Router();
const { Trainer } = require('./model');
const auth=require('../middleware/deepakAuth')

router.post('/',auth, (req, res) => {
    // return res.send('hi');
    try {
        let flg = 0;
        //save files
        if(req.files){
            const filesArray = Object.keys(req.files).map(key => req.files[key])
            // console.log(filesArray)
            filesArray.forEach(doc => {
                doc.mv(`${process.env.FILE_UPLOAD_PATH_CLIENT}${doc.name}`, err => {
                    if (err) {
                        flg = 1;
                    console.error(err);
                        return res.status(500).json({
                            success: 0,
                            error: 'could not upload file',
                            errorReturned:JSON.stringify(err)
                    });
                    }
                });
            })
        }

        if(!flg){
            const trainerArray = JSON.parse(req.body.values);
            trainerArray.forEach(doc => console.log(doc));
            trainerArray.forEach(async trainer => {
                try {
                    const result = await Trainer.create({
                        customer_id: req.user.customer_id,
                        trainer_image_url: 'google.com',
                        trainer_full_name: trainer.fullname,
                        trainer_occupation: trainer.occupation,
                        trainer_phone_number:trainer.phone,
                        trainer_email:trainer.email,
                        trainer_address:trainer.address,
                        trainer_website_url:trainer.website,
                        trainer_linkedin_id:trainer.linkedin,
                        trainer_twitter_id:trainer.twitter,
                        trainer_facebook_id:trainer.facebook,
                        trainer_instagram_id:trainer.instagram,
                        trainer_career_summary:trainer.career_summary,
                        trainer_experience:trainer.experience
                    });
                    if (!result)
                        return res.status(500).json({
                            success: 0,
                            error: "can not upload trainer's data",
                        })
                } catch (err) {
                    console.log('inner catch', err);
                    return res.status(500).json({
                        success: 0,
                        error: "can not upload trainer's data",
                        errorReturned:JSON.stringify(err)
                    })
                }
            })
        }
        if(!flg)
        return res.status(200).json({
            success:1
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: 0,
            error: "can not upload trainer's data",
            errorReturned:JSON.stringify(err)
        })
    }
})

module.exports = router;