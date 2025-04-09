const mongoose = require('mongoose');

const ShippingAdressSchema = new mongoose.Schema(
    {
        adressLine1:{type:String, required:true},
        adressLine2:{type:String, required:false},
        city:{type:String, required:true},
        state:{type:String, required:true},
        postalCode:{type:String, required:true},
        country:{type:String, required:true},
    },
    {_id:false}
);
const UserSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
        },
        email:{
            type:String,
            required:[true, "email is required"],
            unique:true,
            trim:true,
        },
        contact:{
            type:String,
            default:null,
        },
        password:{
            type:String,
            required:[true, "password is required"],
            minlength:[6, "password must be at least 6 characters"],
        },
        shipping_address:{
            type:[ShippingAdressSchema],
            default:[],
        }
    },
    {
        timestamps:true,
    }
        
);

const userModel= mongoose.model("User",UserSchema);
module.exports=userModel; 
