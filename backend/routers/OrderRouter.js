const express=require("express");
const orderRouter= express.Router();
const orderController= require("../controllers/OrderController");

// order placed==0
orderRouter.post("/place_order",(req,res)=>{
        const result=new orderController().placeOrder(req.body);
        result.then(
            (success)=>{
                    res.send(success)
            }
        ).catch(
            (error)=>{
                res.send(error)
            }
        )
})
// order placed==0

// order placed==1
orderRouter.post("/payment-success",(req,res)=>{
    const result=new orderController().paymentSucccess(req.body);
    result.then(
        (success)=>{
                res.send(success)
        }
    ).catch(
        (error)=>{
            res.send(error)
        }
    )
})
// order placed==1


module.exports =orderRouter;