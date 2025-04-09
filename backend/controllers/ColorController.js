const colorModel=require("../models/ColorModel");
const { unlinkSync } = require("fs");
 
class colorController{
    // create color
    create(data){
        return new Promise((resolve,reject)=>{
            try{
                if(!data.name || !data.colorCode){
                    reject(
                        {
                            msg:"Please provide all required fields",
                            status:0
                        }
                    )
                    return
                }
                const color=new colorModel({
                    name:data.name,
                    colorCode:data.colorCode
                })
                color.save().then(
                    ()=>{
                    resolve(
                        {
                            msg:"color created",
                            status:1
                        }
                    )
                    }
                ).catch(
                    ()=>{
                    reject(
                        {
                            msg:"Unable to create color",
                            status:0
                        }
                    )
                    }
                )
            }catch(error){
                reject(
                    {
                        msg:"Internal server error",
                        status:0
                    }
                )
            }
        })
    }
    // create color

    // show color
    get(id){
        return new Promise(
            async (resolve,reject)=>{
                try {
                    let color=null;
                    if (id==null) {
                        color=await colorModel.find();
                    } else {
                        color=await colorModel.findById(id);
                    }
                    if(color){
                        resolve(
                            {
                                msg:"Color found",
                                status:1,
                                color:color
                            }
                        )
                    }else{
                        reject(
                            {
                                msg:"Unable to find color",
                                status:0
                            }
                        )
                    }
                } catch (error) {
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
    // show color 

    // status update
    status(id){
    return new Promise(
    async (resolve,reject)=>{
            try {
                const color =await colorModel.findById(id);
                if(color){
                    colorModel.updateOne(
                        {_id:id},
                        {
                            $set:{
                                status:!color.status
                            }
                        }
                    ).then(
                        ()=>{
                            resolve(
                                {
                                    msg:"Status updated",
                                    status:1
                                }
                            )
                        }
                    ).catch(
                        ()=>{
                            reject(
                                {
                                    msg:"Unable to update status",
                                    status:0
                                }
                            )
                        }
                    )
                }
            } catch (error) {
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
    // status update

    // delete color
    delete(id){
        return new Promise(
        async   (resolve,reject)=>{
                try {
                    const color =await colorModel.findById(id);
                    colorModel.deleteOne(
                        {
                            _id:id
                        },
                    ).then(
                        ()=>{
                            resolve(
                                {
                                    msg:"color deleted",
                                    status:1
                                }
                            )
                        }
                    ).catch(
                        ()=>{
                            reject(
                                {
                                    msg:"Unable to delete color",
                                    status:0
                                }
                            )
                        }
                    )
                } catch (error) {
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
    // delete color

    // edit color
    update(id,data){
        return new Promise(
        async (resolve,reject)=>{
                try {
                    const color =await colorModel.findById(id);
                    if(color){
                        colorModel.updateOne(
                            {_id:id},
                            {
                                $set:{
                                    name:data.name,
                                    colorCode:data.colorCode
                                }
                            }
                        ).then(
                            ()=>{
                                resolve(
                                    {
                                        msg:"Color updated",
                                        status:1
                                    }
                                )
                            }
                        ).catch(
                            ()=>{
                                reject(
                                    {
                                        msg:"Unable to update color",
                                        status:0
                                    }
                                )
                            }
                        )
                    }
                } catch (error) {
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
    // edit color
}

module.exports = colorController;