require('dotenv').config()
const express=require("express");
const server=express();
const mongoose= require("mongoose");
const cors = require("cors");
const categoryRouter= require("./routers/CategoryRouter");
const colorRouter = require("./routers/ColorRouter");
const productRouter = require("./routers/ProductRouter");
const adminRouter = require("./routers/AdminRouter");
const userRouter = require('./routers/UserRouter');

server.use(cors(
    {
        origin:"http://localhost:5173"
    }
));

server.use(express.static("public"));
server.use(express.json());
server.use("/category",categoryRouter);
server.use("/color",colorRouter);
server.use("/product",productRouter);
server.use("/admin",adminRouter);
server.use("/user",userRouter);

mongoose.connect(process.env.MONGODB_URL,{
    dbName:"Ishop"
}).then(
    ()=>{
        console.log("db connected")
        server.listen(
            5000,
            ()=>{
                console.log("server is running")
            }
        )
    }
).catch(
    (error)=>{
        console.log("unable to connect db", error)
    }
);

