const Student=require("./model");
const router=require("express").Router();
const verifyToken=require("../middlewares/verifyToken");
const {db}=require("../../common/db/sql");
router.get("/to_from",verifyToken,async (req,res,next)=>{
    try{

    const  sql=`SELECT
    s.student_first_name,
    s.student_last_name,
    s.student_phone_number,
    s.student_email,
    c.customer_first_name,
    c.customer_last_name,
    c.customer_email,
    c.customer_phone_number
    FROM
    student_tables AS s INNER JOIN customer_tables AS c 
    ON s.customer_id=c.customer_id
    WHERE 
    s.student_id=${req.user.student_id}`;

    const result=await db.query(sql,{type:db.QueryTypes.SELECT});

    return res.status(200).json({
        success: 1,
        result
    });

    }
    catch(e){
            res.json(e);
    }
})

module.exports = router;