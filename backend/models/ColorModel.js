const mongoose=require("mongoose");

const colorSchema=new mongoose.Schema(
        {
            name:{
                type:String,
                unique:true,
                required:true
            },
            colorCode:{
                type:String,
                unique:true,
                required:true
            },
            status:{
                type:Boolean,
                default:true
            }
        },
        {
            timestamps:true
        }
);

const colorModel=mongoose.model("color",colorSchema);

module.exports=colorModel;