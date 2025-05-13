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
    const result=new userController().moveCartToDB(req.params.userId,req.body)
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
    console.log(req.body);
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

// get cart from DB
userRouter.get("/get-cart/:userId", (req, res) => {
    const result = new userController().getCart(req.params.userId);
    result
        .then((success) => {
            res.send(success);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});
// get cart from DB

// remove cart item
userRouter.delete("/remove-from-cart/:userId/:productId", (req, res) => {
    const { userId, productId } = req.params;
    const result = new userController().removeFromCart(userId, productId);
    result
        .then((success) => res.send(success))
        .catch((error) => res.status(500).send(error));
});
// remove cart item

// update cart quantity
userRouter.patch("/update-cart-qty", (req, res) => {
    const { userId, productId, qty } = req.body;
    const result = new userController().updateCartQty(userId, productId, qty);
    result
        .then((success) => res.send(success))
        .catch((error) => res.status(500).send(error));
});
// update cart quantity


module.exports =userRouter;