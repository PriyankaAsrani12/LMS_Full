const router = require('express').Router();
const { User } = require('../Tutor/loginSignup/customer/models');

router.use('/auth', require('./loginSignUp'));
router.use('/sessions', require('./sessions'));
router.use('/blog', require('./blog'));
router.use('/courses', require('./courses'));
router.use('/referal', require('./referalLink'));
router.use('/mycourses', require('./mycourses'));
router.use('/cart', require('./cart'));
router.use('/affiliates', require('./affiliate'));
router.use("/info",require("./loginSignUp/info"));
router.use("/comment",require("./Comment"));


router.get('/clientDetails/:id',async(req,res)=>{
    customer_id=req.params.id
  
    sqlCheck = await User.findOne({
      where: {
        customer_id,
      },
      attributes:['customer_institute_name','customer_institute_logo_url','customer_institute_favicon_icon_url']
    });
  
    if (!sqlCheck) {
      return res.status(404).json({
        success: 0,
        error: 'Client not registered',
      });
    }else{
      return res.json(sqlCheck.dataValues)
    }
})


module.exports = router;
// /student/auth/login
