const {generateUniqueImageName}=require("../helper");
const productModel = require("../models/ProductModel");
const { unlinkSync } = require("fs");
const categoryModel=require("../models/CategoryModel")

class productController{
    // read product
    get(id,query){
        return new Promise(
            async(resolve,reject)=>{
                try{
                    const filterQuery={};
                    if(query.categorySlug!="null"){
                        const category=await categoryModel.findOne({slug:query.categorySlug});
                        if(category){
                            filterQuery["categoryId"]=category._id
                        }
                    }
                    if(query.productColor!="null"){
                        filterQuery["colors"]=query.productColor
                    }
                    let product=null;
                    if(id==null){
                        product=await productModel.find(filterQuery).populate(["categoryId","colors"]).limit(query.limit);
                    }else{
                        product=await productModel.findById(id);
                    }
                    if(product){
                        resolve(
                            {
                                msg:"Product Found",
                                status:1,
                                product:product
                            }
                        )
                    }else{
                        reject(
                            {
                                msg:"Unable to find products",
                                status:0
                            }
                        )
                    }
                }catch(error){
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
    // read product

    // create product
    create(data,thumbnail){
        return new Promise((resolve,reject)=>{
            try{
                if(!data.name || !data.slug || !thumbnail || !data.originalPrice || !data.discountPercentage || !data.categoryId || !data.colors){
                    reject(
                        {
                            msg:"Please provide all required fields",
                            status:0
                        }
                    )
                    return
                }
                const main_img= generateUniqueImageName(thumbnail.name)
                const destination = "./public/product/" + main_img

                thumbnail.mv(
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
                            const product=new productModel({
                                ...data,
                                colors:JSON.parse(data.colors),
                                thumbnail:main_img
                            })
                            product.save().then(
                                ()=>{
                                resolve(
                                    {
                                        msg:"Product created",
                                        status:1
                                    }
                                )
                                }
                            ).catch(
                                ()=>{
                                reject(
                                    {
                                        msg:"Unable to create product",
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
    // create product

    // status change
    status(id,flag){
        return new Promise(
        async (resolve,reject)=>{
                try {
                    const productStatus={};
                    const product =await productModel.findById(id);
                    if(product){
                        if(flag==1){
                            productStatus.status = !product.status
                        } else if(flag==2){
                            productStatus.stock = !product.stock
                        } else if(flag==3){
                            productStatus.topSelling = !product.topSelling
                        }
                        console.log(productStatus)
                        productModel.updateOne(
                            {_id:id},
                            {
                                $set:productStatus
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
    // status change

    // delete product
    delete(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const product = await productModel.findById(id);
                if (!product) {
                    return reject({ msg: "Product not found", status: 0 });
                }
    
                // Try deleting the product image
                if (product.thumbnail) {
                    try {
                        unlinkSync("./public/category/" + product.thumbnail);
                    } catch (err) {
                        console.error("Failed to delete image:", err);
                    }
                }
    
                // Delete the product from the database
                const result = await productModel.deleteOne({ _id: id });
    
                if (result.deletedCount === 1) {
                    resolve({ msg: "Product deleted", status: 1 });
                } else {
                    reject({ msg: "Failed to delete product", status: 0 });
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                reject({ msg: "Internal server error", status: 0 });
            }
        });
    }
    
    // delete product

    //images uplaod
    multipleImage(id,productimg){
        console.log(id,"myid")
        return new Promise(
        async (resolve,reject)=>{
                try {
                    const AllImages =Array.isArray(productimg)?productimg:[productimg]
                    const product =await productModel.findById(id);
                    console.log(product)
                    if(product){
                        console.log(product)
                        const currentProdImages=product.images ?? [];
                        const PromiseUpload=[];
                        if(AllImages!=0){
                            for(let image of AllImages){
                                const name=generateUniqueImageName(image.name);
                                const desti="./public/product/" + name
                                currentProdImages.push(name);
                                PromiseUpload.push(image.mv(desti))
                            }
                            await Promise.all(PromiseUpload)
                            productModel.updateOne(
                                {_id:id},
                                {
                                    $set:{
                                        images:currentProdImages
                                    }
                                }
                            ).then(
                                ()=>{
                                    resolve(
                                        {
                                            msg:"Images uploaded",
                                            status:1
                                        }
                                    )
                                }
                            ).catch(
                                ()=>{
                                    reject(
                                        {
                                            msg:"Unable to upload image",
                                            status:0
                                        }
                                    )
                                }
                            )
                        }
                    }else{
                        reject(
                            {
                                msg:"Image not Found",
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
    //images upload

    //edit product
    update(id, data, files) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const product = await productModel.findById(id);
                    if (files) {
                        // Update all data including the thumbnail
                        const product_img = generateUniqueImageName(files.name);
                        const destination = "./public/product/" + product_img;
                        files.mv(
                            destination,
                            (err) => {
                                if (err) {
                                    reject({
                                        msg: "Unable to upload image",
                                        status: 0
                                    });
                                } else {
                                    unlinkSync("./public/product/" + product.thumbnail);
                                    productModel.updateOne(
                                        { _id: id },
                                        {
                                            $set: {
                                                name: data.name,
                                                slug: data.slug,
                                                originalPrice: data.originalPrice,
                                                discountPercentage: data.discountPercentage,
                                                finalPrice: data.finalPrice,
                                                categoryId: data.categoryId,
                                                shortDescription: data.shortDescription,
                                                longDescription: data.longDescription,
                                                colors: data.colors,
                                                thumbnail: product_img
                                            }
                                        }
                                    ).then(() => {
                                        resolve({
                                            msg: "Product updated",
                                            status: 1
                                        });
                                    }).catch(() => {
                                        reject({
                                            msg: "Unable to update product",
                                            status: 0
                                        });
                                    });
                                }
                            }
                        );
                    } else {
                        // Update only text fields
                        productModel.updateOne(
                            { _id: id },
                            {
                                $set: {
                                    name: data.name,
                                    slug: data.slug,
                                    originalPrice: data.originalPrice,
                                    discountPercentage: data.discountPercentage,
                                    finalPrice: data.finalPrice,
                                    categoryId: data.categoryId,
                                    shortDescription: data.shortDescription,
                                    longDescription: data.longDescription,
                                    colors: data.colors
                                }
                            }
                        ).then(() => {
                            resolve({
                                msg: "Product updated",
                                status: 1
                            });
                        }).catch(() => {
                            reject({
                                msg: "Unable to update product",
                                status: 0
                            });
                        });
                    }
                } catch (error) {
                    reject({
                        msg: "Internal server error",
                        status: 0
                    });
                }
            }
        );
    }    
    //edit product
}

module.exports=productController;