const userModel = require("../models/UserModel")
const {encryptedPassword, decryptedPassword, Generatetoken} = require("../helper")
const cartModel = require("../models/CartModel")

class userController{
    //create user
    register(data){
        return new Promise(
        async (resolve,reject)=>{
                try {
                    if(!data.name || !data.contact || !data.email || !data.password || !data.confirmPassword){
                        reject(
                            {
                                msg:"Please provide all required fields",
                                status:0
                            }
                        )
                        return
                    }
                    if(data.password!=data.confirmPassword){
                        reject(
                            {
                                msg:"Password do not match",
                                status:0
                            }
                        )
                        return
                    }
                    const userCheck = await userModel.findOne({
                        $or:[
                            {email:data.email},
                            {contact:data.contact}
                        ]
                    })
                    if(userCheck){
                        reject(
                            {
                                msg:"This email or contact already exists",
                                status:0
                            }
                        )
                    }else{
                        const user = new userModel({
                            name:data.name,
                            contact:data.contact,
                            email:data.email,
                            password:encryptedPassword(data.password)
                        })
                        user.save().then(
                            ()=>{
                                const token = Generatetoken(user.toJSON())
                                resolve(
                                    {
                                        msg:"User created",
                                        status:1,
                                        user:{...user.toJSON(),password:null},
                                        token
                                    }
                                )
                            }
                        ).catch(
                            ()=>{
                                reject(
                                    {
                                        msg:"Unable to create user",
                                        status:0
                                    }
                                )
                            }
                        )
                    }
                } catch (error) {
                    reject(
                        {
                            msg:"Internal Server error",
                            status:0
                        }
                    )
                }
            }
        )
    }
    //create user

    //login user
    login(data){
        return new Promise(
        async (resolve,reject)=>{
                try {
                    if(!data.email || !data.password){
                        reject(
                            {
                                msg:"Please provide all required fields",
                                status:0
                            }
                        )
                        return
                    }
                    const user = await userModel.findOne({email:data.email})
                    if(user){
                        if(data.password==decryptedPassword(user.password)){
                            resolve(
                                {
                                    msg:"Login successfull",
                                    status:1,
                                    user:{...user.toJSON(),password:null},
                                    token:Generatetoken(user.toJSON())
                                }
                            )
                        }else{
                            reject(
                                {
                                    msg:"Password is incorrect",
                                    status:0
                                }
                            )
                        }
                    }else{
                        reject(
                            {
                                msg:"Account does not exists",
                                status:0
                            }
                        )
                    }
                } catch (error) {
                    reject(
                        {
                            msg:"Internal Server error",
                            status:0
                        }
                    )
                }
            }
        )
    }
    //login user

    //movetodb
    moveCartToDB(userId,data){
        console.log(userId,data)
        return new Promise(
            async (resolve,reject)=>{
                try{
                    const cartData = Array.isArray(data.cartData)
                    ? data.cartData
                    : (typeof data.cartData === "string"
                    ? JSON.parse(data.cartData)
                    : null);
                    console.log(cartData)
                    if(cartData!=null){
                        console.log("📦 Processing local cart items:", cartData);
                        const allPromise = cartData.map(
                            async (cd)=>{
                                // Find existing cart item
                                const d=await cartModel.findOne({
                                    userId: userId,
                                    product_id: cd.productId
                                });
                                
                                if(d){
                                    // If item exists, update quantity
                                    console.log(`🔄 Updating quantity for product ${cd.productId} from ${d.qty} to ${d.qty + Number(cd.qty)}`);
                                    await cartModel.updateOne(
                                        {_id:d._id},
                                        {
                                            $inc:{
                                                qty:Number(cd.qty)
                                            }
                                        }
                                    )
                                }else{
                                    // If item doesn't exist, create new entry
                                    console.log(`➕ Adding new product ${cd.productId} with quantity ${cd.qty}`);
                                    await new cartModel({
                                        userId:userId,
                                        product_id:cd.productId,
                                        qty:cd.qty,
                                        originalPrice: cd.originalPrice,
                                        finalPrice: cd.finalPrice
                                    }).save()
                                }
                            }
                        )
                        await Promise.all(allPromise)
                        
                        // Fetch updated cart
                        const dbCartData=await cartModel.find({userId:userId})
                            .populate("product_id","_id originalPrice finalPrice")
                        
                        console.log("✅ Cart merge completed. Final cart:", dbCartData);
                        
                        resolve(
                            {
                                msg:"Cart moved to db",
                                status:1,
                                dbCartData
                            }
                        )
                    }else{
                        const dbCartData=await cartModel.find({userId:userId})
                            .populate("product_id","_id originalPrice finalPrice")
                        resolve(
                            {
                                status:1,
                                dbCartData
                            }
                        )
                    }
                }catch(error){
                    console.error("❌ Error in moveToDb:", error)
                    reject(
                        {
                            msg:"Internal server error",
                            status:0
                        }
                    )
                }
            }
        )
    }
    //movetodb

    //dbtocart
    addToCart(cd){
        return new Promise(
            async (resolve,reject)=>{
                try{
                    const d=await cartModel.findOne({userId:cd.userId,product_id:cd.productId})
                                if(d){
                                    //qty increase
                                    await cartModel.updateOne(
                                        {_id:d._id},
                                        {
                                            $inc:{
                                                qty:1
                                            }
                                        }
                                    )
                                }else{
                                    //new insert
                                    await new cartModel({
                                        userId:cd.userId,
                                        product_id:cd.productId,
                                        qty:1
                                    }).save()
                                }
                                resolve({
                                    msg: "Item added to cart",
                                    status: 1
                                  })
                    }catch(error){
                    console.log(error)
                    reject(
                        {
                            msg:"Internal server error",
                            status:0
                        }
                    )
                }
            }
        )
    }
    //dbtocart

    //removeFromCart
    removeFromCart(userId, productId) {
        return new Promise(async (resolve, reject) => {
          try {
            const cartItem = await cartModel.findOne({ userId: userId, product_id: productId });
            if (cartItem) {
              // Remove the item from the cart
              await cartModel.deleteOne({ _id: cartItem._id });
              resolve({
                msg: "Item removed from cart",
                status: 1,
              });
            } else {
              reject({
                msg: "Item not found in cart",
                status: 0,
              });
            }
          } catch (error) {
            reject({
              msg: "Internal Server Error",
              status: 0,
            });
          }
        });
    }
    //removeFromCart

    // get cart from DB
    getCart(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                // Fetch the cart data from the database
                const cartItems = await cartModel.find({ userId }).populate("product_id", "_id originalPrice finalPrice");
    
                if (!cartItems || cartItems.length === 0) {
                    resolve({
                        msg: "Cart is empty",
                        status: 1,
                        dbCartData: [] // Return empty array if no cart items exist
                    });
                } else {
                    resolve({
                        msg: "Fetched cart successfully",
                        status: 1,
                        dbCartData: cartItems // Return the populated cart data
                    });
                }
            } catch (error) {
                console.log(error);
                reject({
                    msg: "Internal server error",
                    status: 0
                });
            }
        });
    }
    // get cart from DB

    // updateCartQty
    updateCartQty(userId, productId, qty) {
    return new Promise(async (resolve, reject) => {
        try {
            if (qty <= 0) {
                // Delete item if quantity is zero or less
                const deleted = await cartModel.deleteOne({ userId: userId, product_id: productId });
                if (deleted.deletedCount > 0) {
                    resolve({
                        msg: "Item removed from cart due to zero quantity",
                        status: 1,
                    });
                } else {
                    reject({
                        msg: "Item not found in cart",
                        status: 0,
                    });
                }
            } else {
                const updated = await cartModel.updateOne(
                    { userId: userId, product_id: productId },
                    { $set: { qty: qty } }
                );

                if (updated.modifiedCount > 0) {
                    resolve({
                        msg: "Quantity updated successfully",
                        status: 1,
                    });
                } else {
                    reject({
                        msg: "Item not found or quantity unchanged",
                        status: 0,
                    });
                }
            }
        } catch (error) {
            console.log(error);
            reject({
                msg: "Internal Server Error",
                status: 0,
            });
        }
    });
    }
    // updateCartQty

}

module.exports = userController