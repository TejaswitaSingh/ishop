const { Verifytoken } = require("../helper")

const adminAuth=(req,res,next)=>{
const adminToken=req?.headers?.authorization
if(adminToken){
    if(Verifytoken(adminToken)){
        next()
    }else{
        res.send(
            {
                msg:"Invalid token",
                status:0
            }
        )
    }
}else{
    res.send(
        {
            msg:"Access to token missing",
            status:0
        }
    )
}
}
module.exports=adminAuth