const router = require('express').Router();
// const Razorpay = require('razorpay');
const crypto = require('crypto');

const { db } = require('../../common/db/sql');
const verifyToken = require('../middlewares/verifyToken');
// const Cart = require('./cartModel');
const Student = require('../loginSignUp/model');
// const RazorpayModel = require('./RazorpayModel');
const Course = require('../courses/model');

router.use('/coupon', require('./coupon'));

const Cart=require("./cartModel");
const Save=require("./saveModel");
const Wish=require("./wishModel");


router.put("/update_cart_item",verifyToken,async(req,res)=>{
    
    console.log(req.body.course);
    try{
        Cart.update(
            {courses:req.body.course},
            {returning: true,where:{cart_item_id:req.body.id}
        })
        .then(async function([ rowsUpdate, [updatedBook] ]) {
            
            const cart=await Cart.findAll({})
            res.status(200).json({cart:cart});
          })
          .catch(next=>{console.log(next);})
    }
    catch(e){
        res.status(401).send({
            message: "Unable to update cart list",
            err:e
        })
    }
})

router.post("/add_to_cart",verifyToken,async (req,res)=>{
    try{
      const { session_id } = req.body.values;
          console.log(req.body.values);
       
          
    //   const isExist=await Cart.findOne({
    //     where: { student_id: 1, session_id :1},
    //   });

    //   if(isExist){
    //       //  Run update query
    //   const result = await Cart.update(
    //     { where: { student_id: 1, session_id:1 } }
    //   );

    //     console.log(result);
    //     return res.status(200).json({
    //       success: 1,
    //       result,
    //     });
    //   }else {
              //    run create query
        
              const result = await Cart.create({
                student_id:req.user.student_id,
                session_id
              });
              console.log(result);
              return res.status(200).json({
                success: 1,
              });
        //    }
   }
    catch (e){
        res.status(401).send({
            message: "Unable to add to cart list",
            err:e
        })
    }

})


router.get("/cart_list",verifyToken,async(req,res)=>{
    try{
        const sql = `SELECT 
                 s.session_id,
                 s.session_name,
                 s.session_description,
                 s.session_fee,
                 s.session_thumbnail,
                 c.cart_item_id
                 FROM
                 session_tables AS s INNER JOIN cart_tables AS c ON  c.session_id=s.session_id 
                 WHERE  
                 c.student_id=${req.user.student_id}
                `;
       const result = await db.query(sql, { type: db.QueryTypes.SELECT });
        // const cart=await Cart.findAll({
            // where: {student_id:1},
            // include: [{
            //     model:"session_tables",
            //     as:""
            // }]
        // })
        // console.log(result);
        return res.status(200).json({
                  success: 1,
                  result,
                });
        
        // res.status(200).json({cart:cart});

    }
    catch (e){
        res.status(401).send({
            message: "Unable to show from cart list",
            err:e
        })
    }

})


router.get("/remove_cart_list",verifyToken,async(req,res)=>{
    try{
        const cart=await Cart.destroy({
            where:{},
            restartIdentity: true,
            truncate: true

        })
        // console.log(cart);
        res.json(cart)

    }
    catch (e){
        res.status(401).send({
            message: "Unable to remove all the items from cart list",
            err:e
        })
    }

})



router.post("/remove_item_cart_list",verifyToken,async(req,res)=>{
    try{
        const cart=await Cart.destroy({
            where:{cart_item_id:req.body.cart_item_id,
            student_id:req.user.student_id},
            restartIdentity: true,
        })
        console.log(cart);
        // res.status(200).json({cart:cart})

    }
    catch (e){
        res.status(401).send({
            message: "Unable to remove item from the  cart list",
            err:e
        })
    }

})


// wish 

router.post("/add_to_wish",verifyToken,async (req,res)=>{
    
        
    // try{
    

        try{
            const {session_id}=req.body.item;
        const result = await Wish.create({
            student_id:req.user.student_id,
            session_id
          });
          console.log(result);
          return res.status(200).json({
            success: 1,
            result
          });
        }
        catch(e){
            res.status(401).send({
              message: "Unable to add to cart list",
                 err:e
                })
        }
        
        // res.status(200).json({save:save})
    // }
    // catch (e){
    //     res.status(401).send({
    //         message: "Unable to add to save list",
    //         err:e
    //     })
    // }
    // try{
        
    //     let {student_id, session_id}=req.body.courses
    //     const wish=await Wish.create({
    //       student_id:1,
    //       session_id:session_id
    //     })
        
    //     res.status(200).json({wish:wish});
    // }
    // catch (e){
    //     res.status(401).send({
    //         message: "Unable to add to cart list",
    //         err:e
    //     })
    // }

})
router.get("/wish_list",verifyToken,async (req,res)=>{

   try{
    const sql = `SELECT 
    s.session_id,
    s.session_name,
    s.session_description,
    s.session_fee,
    s.session_thumbnail,
    c.wish_item_id
    FROM
    session_tables AS s INNER JOIN wish_tables AS c ON  c.session_id=s.session_id 
    WHERE  
    c.student_id=${req.user.student_id}
   `;
const result = await db.query(sql, { type: db.QueryTypes.SELECT });

    return res.status(200).json({
    success: 1,
    result});
    }catch(e){
        res.status(401).send({
            message: "Unable to get save list",
            err:e
        })
    }
    // try{
    //     const wish=await Wish.findAll({});
        
    //     res.status(200).json({wish:wish});
    // }
    // catch (e){
    //     res.status(401).send({
    //         message: "Unable to get wish list",
    //         err:e
    //     })
    // }
})

router.post("/remove_item_wish_list",verifyToken,async (req,res)=>{

    try{
        const wish=await Wish.destroy({
            where:{wish_item_id:req.body.wish_item_id,
            student_id:req.user.student_id},
            restartIdentity: true,
            
        });
        
        res.status(200).send(req.body.wish_item_id);
        
    }
    catch (e){
        res.status(401).send({
            message: "Unable to get save list",
            err:e
        })
    }

})

router.get("/remove_wish_list",verifyToken,async (req,res)=>{
    try{
        const wish=await Wish.destroy({
            where:{},
            restartIdentity: true,
            truncate: true
        });
        
        res.status(200).json({wish:wish});
    }
    catch (e){
        res.status(401).send({
            message: "Unable to get wish list",
            err:e
        })
    }
})


router.post("/add_to_save",verifyToken,async (req,res)=>{
    try{

        const {session_id}=req.body.item;
        const result = await Save.create({
            student_id:req.user.student_id,
            session_id
          });
          console.log(result);
          return res.status(200).json({
            success: 1,
            result
          });
        
        // res.status(200).json({save:save})
    }
    catch (e){
        res.status(401).send({
            message: "Unable to add to save list",
            err:e
        })
    }

})

router.get("/save_list",verifyToken,async (req,res)=>{
    try{
        const sql = `SELECT 
        s.session_id,
        s.session_name,
        s.session_description,
        s.session_fee,
        s.session_thumbnail,
        c.save_item_id
        FROM
        session_tables AS s INNER JOIN save_tables AS c ON  c.session_id=s.session_id 
        WHERE  
        c.student_id=${req.user.student_id}
       `;
        const result = await db.query(sql, { type: db.QueryTypes.SELECT });
        // const cart=await Cart.findAll({
        // where: {student_id:1},
        // include: [{
        //     model:"session_tables",
        //     as:""
        // }]
        // })
        // console.log(result);
        return res.status(200).json({
                success: 1,
                result,
            });
        
    }
    catch (e){
        res.status(401).send({
            message: "Unable to get save list",
            err:e
        })
    }

})

router.get("/remove_save_list",verifyToken,async (req,res)=>{
    try{
        const save=await Save.destroy({
            where:{},
            restartIdentity: true,
            truncate: true
        })
        
        res.json(save);
        
    }
    catch (e){
        res.status(401).send({
            message: "Unable to get save list",
            err:e
        })
    }

})
router.post("/remove_item_save_list",verifyToken,async (req,res)=>{
    try{
        const save=await Save.destroy({
            where:{save_item_id:req.body.save_item_id,
            student_id:req.user.student_id},
            restartIdentity: true,
            
        });
        
        res.status(200).send(save);
        
    }
    catch (e){
        res.status(401).send({
            message: "Unable to get save list",
            err:e
        })
    }

})

// razor pay
router.use("/",require("./pay"))

module.exports=router;



