const categoryModel = require("../models/CategoryModel");
const {generateUniqueImageName}=require("../helper");
const { unlinkSync } = require("fs");
const productModel = require("../models/ProductModel");
 
class categoryController{
    // create category
    create(data,category_image){
        return new Promise((resolve,reject)=>{
            try{
                if(!data.name || !data.slug || !category_image){
                    reject(
                        {
                            msg:"Please provide all required fields",
                            status:0
                        }
                    )
                    return
                }
                const category_img= generateUniqueImageName(category_image.name)
                const destination = "./public/category/" + category_img
                category_image.mv(
                    destination,
                    (error)=>{
                        if(error){
                            reject(
                                {
                                    msg:"Unable to uplaod image",
                                    status:0
                                }
                            )
                        }else{
                            const category=new categoryModel({
                                name:data.name,
                                slug:data.slug,
                                category_image: category_img
                            })
                            category.save().then(
                                ()=>{
                                resolve(
                                    {
                                        msg:"category created",
                                        status:1
                                    }
                                )
                                }
                            ).catch(
                                ()=>{
                                reject(
                                    {
                                        msg:"Unable to create category",
                                        status:0
                                    }
                                )
                                }
                            )
                        }
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
    // create category 

    // show category
    get(id){
        return new Promise(
           async (resolve,reject)=>{
                try {
                    let category=null;
                    if (id==null) {
                        category=await categoryModel.find();
                        if(category){
                            const data=[];
                            const promise=category.map(
                                async (cat)=>{
                                    const productCount=await productModel.find({
                                        categoryId:cat._id
                                    }).countDocuments()
                                    data.push(
                                        {
                                            ...cat.toJSON(),
                                            productCount
                                        }
                                    )
                                }
                            )
                            await Promise.all(promise)
                            resolve(
                                {
                                    msg:"category found",
                                    status:1,
                                    category:data
                                }
                            )
                        }else{
                            reject(
                                {
                                    msg:"Unable to find category",
                                    status:0
                                }
                            )
                        }
                    } else {
                        category=await categoryModel.findById(id);
                        if(category){
                            resolve(
                                {
                                    msg:"category found",
                                    status:1,
                                    category:category
                                }
                            )
                        }else{
                            reject(
                                {
                                    msg:"Unable to find category",
                                    status:0
                                }
                            )
                        }
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
    // show category 

    // status update
    status(id){
    return new Promise(
    async (resolve,reject)=>{
            try {
                const category =await categoryModel.findById(id);
                if(category){
                    categoryModel.updateOne(
                        {_id:id},
                        {
                            $set:{
                                status:!category.status
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

    // delete category
    delete(id) {
        return new Promise(async (resolve, reject) => {
            try {
                // Find the category
                const category = await categoryModel.findById(id);
    
                // Check if category exists
                if (!category) {
                    return reject({
                        msg: "Category not found",
                        status: 0
                    });
                }
    
                // Delete image if it exists
                if (category.category_image) {
                    try {
                        unlinkSync("./public/category/" + category.category_image);
                    } catch (error) {
                        console.error("Error deleting image:", error);
                    }
                }
    
                // Delete category
                await categoryModel.deleteOne({ _id: id });
    
                resolve({
                    msg: "Category deleted successfully",
                    status: 1
                });
            } catch (error) {
                reject({
                    msg: "Internal server error",
                    status: 0
                });
            }
        });
    }
    
    // delete category

    // edit category
    update(id,data,files){
        return new Promise(
            async (resolve,reject)=>{
                try {
                    const category=await categoryModel.findById(id);
                    if(files){
                        // update all data
                        const category_img = generateUniqueImageName(files.name);
                        const destination="./public/category/" + category_img;
                        files.mv(
                            destination,
                            (err)=>{
                                if(err){
                                    reject(
                                        {
                                            msg:"Unable to uplaod image",
                                            status:0
                                        }
                                    )
                                } else{
                                    unlinkSync("./public/category/" + category.category_image)
                                    categoryModel.updateOne(
                                        {
                                            _id:id
                                        },
                                        {
                                            $set:{
                                                name:data.name,
                                                slug:data.slug,
                                                category_image:category_img
                                            }
                                        }
                                    ).then(
                                        ()=>{
                                            resolve(
                                                {
                                                    msg:"Category updated",
                                                    status:1
                                                }
                                            )
                                        }
                                    ).catch(
                                        ()=>{
                                            reject(
                                                {
                                                    msg:"Unable to update category",
                                                    status:0
                                                }
                                            )
                                        }
                                    )
                                }
                            }
                        )
                    }else{
                        // update only name and slug
                        categoryModel.updateOne(
                            {
                                _id:id
                            },
                            {
                                $set:{
                                    name:data.name,
                                    slug:data.slug
                                }
                            }
                        ).then(
                            ()=>{
                                resolve(
                                    {
                                        msg:"Category updated",
                                        status:1
                                    }
                                )
                            }
                        ).catch(
                            ()=>{
                                reject(
                                    {
                                        msg:"Unable to update category",
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
    // edit category
}

module.exports = categoryController;