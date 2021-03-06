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

router.put("/add_to_cart",verifyToken,async (req,res)=>{
    try{
      const { student_cart_items } = req.body.values;
          
       
          const sql1 = `SELECT 
          s.student_cart_items
          FROM
          student_tables AS s
          WHERE  
          s.student_id=${req.user.student_id}
         `;
            const result = await db.query(sql1, { type: db.QueryTypes.SELECT });
            console.log(result[0].student_cart_items);
            if(result[0].student_cart_items!=0){
                result[0].student_cart_items=JSON.parse(result[0].student_cart_items)
                result[0].student_cart_items.push(student_cart_items)
                let cart_item=JSON.stringify(result[0].student_cart_items);
                console.log(typeof(cart_item));
                const data=await Student.update(
                    {student_cart_items:cart_item},
                    {where:{student_id:req.user.student_id}}
                    )
                return res.status(200).json({
                    success: 1,
                    result:data
                }) 
            }
            
            let cart_item=JSON.stringify([student_cart_items]);
            const data=await Student.update(
            {student_cart_items:cart_item},
            {where:{student_id:req.user.student_id}}
            )
            console.log(data);
            res.status(200).json({
                data:data
            })
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
        const sql1 = `SELECT 
                 
                 s.student_cart_items
                 FROM
                 student_tables AS s 
                 WHERE  
                 s.student_id='${req.user.student_id}'
                `;

             
       const result = await db.query(sql1, { type: db.QueryTypes.SELECT });
       console.log(JSON.parse(result[0].student_cart_items).length);
        if(JSON.parse(result[0].student_cart_items).length){
            let results=JSON.parse(result[0].student_cart_items)
        let dataIs=[];
        results.map(async (data,index)=>{
            
                const sql2=`SELECT
                s.session_id,
                s.session_name,
                s.session_description,
                s.session_fee
                FROM 
                session_tables AS s  
                WHERE
                 s.session_id=${data} 
                `
            let info = await db.query(sql2,{ type: db.QueryTypes.SELECT });
            
            dataIs.push(info);
            if(dataIs.length==results.length){
                return res.status(200).json({
                    success: 1,
                    dataIs,
                });
            }
         })
        }else{
            return res.status(200).json({
                success: 1,
                dataIs:[],
            });
        }
            // console.log(dataIs,"Jitul");
            // if(dataIs.length>0){
                
            // }
        // res.status(200).json({cart:cart});

    }
    catch (e){
        res.status(401).json({
            message: "Unable to show from cart list",
            err:e
        })
    }

})


router.post("/remove_item_cart_list",verifyToken,async(req,res)=>{
    
        try{
            
            const sql1 = `SELECT 
                     
                     s.student_cart_items
                     FROM
                     student_tables AS s 
                     WHERE  
                     s.student_id=${req.user.student_id}
                    `;
    
                 
           const result = await db.query(sql1, { type: db.QueryTypes.SELECT });
            if(result[0].student_cart_items!=0){
                let results=JSON.parse(result[0].student_cart_items)
                console.log(req.body.cart_item_id);
                dataIs=results.filter(data=>data!=req.body.cart_item_id )
    
            const data=await Student.update(
                {student_cart_items:JSON.stringify(dataIs)},
                {where:{student_id:req.user.student_id}}
                )
                console.log(data);
                
    
             if(data){
                res.status(200).json({
                    dataIs:data,
                    id:req.body.cart_item_id
                })
             }
    
            }else{
                res.status(200).json({
                    dataIs:[],
                    id:req.body.cart_item_id
                })
            }
                // console.log(dataIs,"Jitul");
                // if(dataIs.length>0){
                    
                // }
            
    
        }
        catch (e){
            res.status(401).json({
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






// wish 

router.put("/add_to_wish",verifyToken,async (req,res)=>{
    
    try{
        const { student_wish_list_items } = req.body.values;
            
         
            const sql1 = `SELECT 
            s.student_wish_list_items
            FROM
            student_tables AS s
            WHERE  
            s.student_id=${req.user.student_id}
           `;
              const result = await db.query(sql1, { type: db.QueryTypes.SELECT });
              console.log(result[0].student_wish_list_items);
              if(result[0].student_wish_list_items!=0){
                  result[0].student_wish_list_items=JSON.parse(result[0].student_wish_list_items)
                  result[0].student_wish_list_items.push(student_wish_list_items)
                  let cart_item=JSON.stringify(result[0].student_wish_list_items);
                  console.log(typeof(cart_item));
                  const data=await Student.update(
                      {student_wish_list_items:cart_item},
                      {where:{student_id:req.user.student_id}}
                      )
                  return res.status(200).json({
                    success: 1,
                    result:data
                  }) 
              }
              
              let cart_item=JSON.stringify([student_wish_list_items]);
              const data=await Student.update(
              {student_wish_list_items:cart_item},
              {where:{student_id:req.user.student_id}}
              )
              console.log(data);
              res.status(200).json({
                  data:data
              })
     }
      catch (e){
          res.status(401).send({
              message: "Unable to add to cart list",
              err:e
          })
      }
})
router.get("/wish_list",verifyToken,async (req,res)=>{

    try{
        const sql1 = `SELECT 
                 
                 s.student_wish_list_items
                 FROM
                 student_tables AS s 
                 WHERE  
                 s.student_id=${req.user.student_id}
                `;

             
       const result = await db.query(sql1, { type: db.QueryTypes.SELECT });
        if(JSON.parse(result[0].student_wish_list_items).length){
            let results=JSON.parse(result[0].student_wish_list_items)
        let dataIs=[];
        results.map(async (data,index)=>{
            
                const sql2=`SELECT
                s.session_id,
                s.session_name,
                s.session_description,
                s.session_fee
                FROM 
                session_tables AS s  
                WHERE
                 s.session_id=${data} 
                `
            let info = await db.query(sql2,{ type: db.QueryTypes.SELECT });
            
            dataIs.push(info);
            if(dataIs.length==results.length){
                return res.status(200).json({
                    success: 1,
                    dataIs,
                });
            }
         })
        }else{
            return res.status(200).json({
                success: 1,
                dataIs:[],
            });
        }
            // console.log(dataIs,"Jitul");
            // if(dataIs.length>0){
                
            // }
        // res.status(200).json({cart:cart});

    }
    catch (e){
        res.status(401).json({
            message: "Unable to show from cart list",
            err:e
        })
    }
})

router.post("/remove_item_wish_list",verifyToken,async (req,res)=>{

    try{
        
        const sql1 = `SELECT 
                 
                 s.student_wish_list_items
                 FROM
                 student_tables AS s 
                 WHERE  
                 s.student_id=${req.user.student_id}
                `;

             
       const result = await db.query(sql1, { type: db.QueryTypes.SELECT });
        if(result[0].student_wish_list_items!=0){
            let results=JSON.parse(result[0].student_wish_list_items)
        console.log(req.body.wish_item_id);
        dataIs=results.filter(data=>data!=req.body.wish_item_id )
        console.log(dataIs);
        const data=await Student.update(
            {student_wish_list_items:JSON.stringify(dataIs)},
            {where:{student_id:req.user.student_id}}
            )
            
         if(data){
            res.status(200).json({
                dataIs:dataIs,
                id:req.body.wish_item_id
            })
         }   
        }else{
            res.status(200).json({
                dataIs:[],
                id:req.body.wish_item_id
            })            
        }

         

            // console.log(dataIs,"Jitul");
            // if(dataIs.length>0){
                
            // }
        

    }
    catch (e){
        res.status(401).json({
            message: "Unable to show from cart list",
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


router.put("/add_to_save",verifyToken,async (req,res)=>{
    try{
        const { student_saved_for_later } = req.body.values;
            
         
            const sql1 = `SELECT 
            s.student_saved_for_later
            FROM
            student_tables AS s
            WHERE  
            s.student_id=${req.user.student_id}
           `;
              const result = await db.query(sql1, { type: db.QueryTypes.SELECT });
              console.log(result[0].student_saved_for_later);
              if(result[0].student_saved_for_later!=0){
                  result[0].student_saved_for_later=JSON.parse(result[0].student_saved_for_later)
                  result[0].student_saved_for_later.push(student_saved_for_later)
                  let cart_item=JSON.stringify(result[0].student_saved_for_later);
                  console.log(typeof(cart_item));
                  const data=await Student.update(
                      {student_saved_for_later:cart_item},
                      {where:{student_id:req.user.student_id}}
                      )
                  return res.status(200).json({
                      success: 1,
                      result:data
                  }) 
              }
              
              let cart_item=JSON.stringify([student_saved_for_later]);
              const data=await Student.update(
              {student_saved_for_later:cart_item},
              {where:{student_id:req.user.student_id}}
              )
              console.log(data);
              res.status(200).json({
                  data:data
              })
     }
      catch (e){
          res.status(401).send({
              message: "Unable to add to cart list",
              err:e
          })
      }
})

router.get("/save_list",verifyToken,async (req,res)=>{
    try{
        const sql1 = `SELECT 
                 
                 s.student_saved_for_later
                 FROM
                 student_tables AS s 
                 WHERE  
                 s.student_id=${req.user.student_id}
                `;

             
       const result = await db.query(sql1, { type: db.QueryTypes.SELECT });
       console.log(result)
        if(JSON.parse(result[0].student_saved_for_later).length){
            let results=JSON.parse(result[0].student_saved_for_later)
        let dataIs=[];
        results.map(async (data,index)=>{
            
                const sql2=`SELECT
                s.session_id,
                s.session_name,
                s.session_description,
                s.session_fee
                FROM 
                session_tables AS s  
                WHERE
                 s.session_id=${data} 
                `
            let info = await db.query(sql2,{ type: db.QueryTypes.SELECT });
            
            dataIs.push(info);
            if(dataIs.length==results.length){
                return res.status(200).json({
                    success: 1,
                    dataIs,
                });
            }
         })
        }else{
            return res.status(200).json({
                success: 1,
                dataIs:[],
            });
        }
            // console.log(dataIs,"Jitul");
            // if(dataIs.length>0){
                
            // }
        // res.status(200).json({cart:cart});

    }
    catch (e){
        res.status(401).json({
            message: "Unable to show from cart list",
            err:e
        })
    }

})


router.post("/remove_item_save_list",verifyToken,async (req,res)=>{
    try{
        
        const sql1 = `SELECT 
                 
                 s.student_saved_for_later
                 FROM
                 student_tables AS s 
                 WHERE  
                 s.student_id=${req.user.student_id}
                `;

             
       const result = await db.query(sql1, { type: db.QueryTypes.SELECT });
        if(result[0].student_saved_for_later!=0){
            let results=JSON.parse(result[0].student_saved_for_later)
        console.log(req.body.save_item_id);
        dataIs=results.filter(data=>data!=req.body.save_item_id )

        const data=await Student.update(
            {student_saved_for_later:JSON.stringify(dataIs)},
            {where:{student_id:req.user.student_id}}
            )
            console.log(data);
            

         if(data){
            res.status(200).json({
                dataIs:data,
                id:req.body.save_item_id
            })
         }

        }else{
            res.status(200).json({
                dataIs:[],
                id:req.body.save_item_id
            })
        }
            // console.log(dataIs,"Jitul");
            // if(dataIs.length>0){
                
            // }
        

    }
    catch (e){
        res.status(401).json({
            message: "Unable to show from cart list",
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


// razor pay
router.use("/",require("./pay"))

module.exports=router;



