const express=require("express");
const userRouter= express.Router();
const userController=require("../controllers/UserController");

// create user
userRouter.post("/register",(req,res)=>{
        const result=new userController().register(req.body);
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
// create user

// login user
userRouter.post("/login",(req,res)=>{
    const result=new userController().login(req.body);
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
// login user

// move to db
userRouter.post("/move-to-db/:userId",(req,res)=>{
    const result=new userController().moveToDb(req.params.userId,req.body)
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
// move to db

// add to cart
userRouter.post("/add-to-cart",(req,res)=>{
    const result=new userController().addToCart(req.body);
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
// add to cart

module.exports =userRouter;