const adminModel = require("../models/AdminModel")
const {encryptedPassword, decryptedPassword, Generatetoken} = require("../helper")

class adminController{
    //create admin
    register(data){
        return new Promise(
        async (resolve,reject)=>{
                try {
                    if(!data.name || !data.contact || !data.email || !data.password){
                        reject(
                            {
                                msg:"Please provide all required fields",
                                status:0
                            }
                        )
                        return
                    }
                    const adminCheck = await adminModel.findOne({
                        $or:[
                            {email:data.email},
                            {contact:data.contact}
                        ]
                    })
                    if(adminCheck){
                        reject(
                            {
                                msg:"This email or contact already exists",
                                status:0
                            }
                        )
                    }else{
                        const admin = new adminModel({
                            name:data.name,
                            contact:data.contact,
                            email:data.email,
                            password:encryptedPassword(data.password)
                        })
                        admin.save().then(
                            ()=>{
                                resolve(
                                    {
                                        msg:"Admin created",
                                        status:1
                                    }
                                )
                            }
                        ).catch(
                            ()=>{
                                reject(
                                    {
                                        msg:"Unable to create admin",
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
    //create admin

    //login admin
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
                    const admin = await adminModel.findOne({email:data.email})
                    if(admin){
                        if(data.password==decryptedPassword(admin.password)){
                            resolve(
                                {
                                    msg:"Login successfull",
                                    status:1,
                                    admin:{...admin.toJSON(),password:null},
                                    token:Generatetoken(admin.toJSON())
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
    //login admin
}

module.exports = adminController