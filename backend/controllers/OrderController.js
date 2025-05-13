require("dotenv").config();
const orderModel=require("../models/OrderModel")
const cartModel=require("../models/CartModel");
const crypto=require("crypto");

const Razorpay = require('razorpay');

var RazorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_id,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });


class orderController{
    placeOrder(orderData){
        return new Promise(
        async (resolve,reject)=>{
                try {
                    const {user_id, order_total, payment_mode, shipping_details, product_details} = orderData;
                    
                    // Validate required fields
                    if (!user_id || !order_total || payment_mode === undefined || !shipping_details || !product_details) {
                        console.log("Missing required fields:", { user_id, order_total, payment_mode, shipping_details, product_details });
                        return reject({
                            msg: "Missing required fields",
                            status: 0
                        });
                    }

                    // Create the order
                    const order = new orderModel({
                        user_id: user_id,
                        product_details: product_details,
                        order_total: order_total,    
                        payment_mode: payment_mode,
                        shipping_details: shipping_details
                    });
                    
                    order.save().then(
                        async (savedOrder) => {
                            console.log("Deleting cart items for user:", user_id);
                            await cartModel.deleteMany({ userId: user_id }).then(
                                (success)=>{
                                    console.log("Cart items deleted successfully:", success);
                                }
                            ).catch(
                                (error)=>{
                                    console.log("Error deleting cart items:", error);
                                }
                            )

                            if(payment_mode === 0){
                                // COD
                                resolve({
                                    msg: "Order placed successfully",
                                    status: 1,
                                    order_id: savedOrder._id
                                });
                            } else {
                                // online payment
                                this.initialPaymentGateway(order._id,order_total).then(
                                    (razorpay_order)=>{
                                    resolve(
                                        {
                                            msg: "Order placed successfully",
                                            status: 1,
                                            razorpay_order
                                        }
                                    )
                                    }
                                ).catch(
                                    ()=>{
                                    reject(
                                        {
                                            msg: "Unable to place order",
                                            status: 0
                                        }
                                    );
                                    }
                                )
                            }
                        }
                    ).catch(
                        () => {
                            reject({
                                msg: "Unable to place order: ",
                                status: 0
                            });
                        }
                    );
                } catch (error) {
                    reject({
                        msg: "Internal Server error: ",
                        status: 0
                    });
                }
            }
        );
    }

    initialPaymentGateway(order_id,order_total){
        return new Promise(
            (resolve,reject)=>{
                try {
                    var options = {
                        amount: order_total*100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                        currency: "INR",
                        receipt: order_id
                        };
                        RazorpayInstance.orders.create(options,async function(err, razorpay_order) {
                            if(err){
                                reject(
                                    {
                                        msg:"Payment Gateway error",
                                        status:0
                                    }
                                )
                            }else{
                                await orderModel.updateOne(
                                    {
                                        _id:order_id
                                    },
                                    {
                                        razorpay_order_id:razorpay_order.id
                                    }
                                    
                                )
                                resolve(
                                    {
                                        msg:"Payment Gateway created successfully",
                                        status:1,
                                        order_id:razorpay_order.id,
                                        amount: razorpay_order.amount,
                                        currency: razorpay_order.currency,
                                        receipt: razorpay_order.receipt
                                    }
                                )
                            }

                        });
                } catch (error) {
                    reject({
                        msg: "Internal Server error: ",
                        status: 0
                    });
                }
            }
        )
    }

    async paymentSucccess(order_data){
        return new Promise(async(resolve,reject)=>{
            try{
                const{order_id,user_id,razorpay_response}=order_data;
                //create data string for signature verification
                const data=`${razorpay_response.razorpay_order_id}|${razorpay_response.razorpay_payment_id}`;
                //generate HMAC-SHA256 signature using secret key
                const generatedSignature=crypto
                .createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
                .update(data)
                .digest('hex');
                //compare signature
                if(generatedSignature===razorpay_response.razorpay_signature){
                    await cartModel.deleteMany({user_id});
                    // 
                await orderModel.updateOne(
                    {razorpay_order_id:razorpay_response.razorpay_order_id},
                    {
                        razorpay_payment_id:razorpay_response.razorpay_payment_id,
                        order_status:1
                    }
                );
                resolve({status:1,msg:"Order Places"});
                }else{
                    reject({status:0,msg:"Payment verification failed"});
                }
            }catch(error){
                console.log(error);
                reject({msg:"Internal server error",status:0});
            }
        })
    }
}

module.exports=orderController;