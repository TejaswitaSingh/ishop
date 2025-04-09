const express=require("express");
const productRouter=express.Router();
const fileUpload = require ("express-fileupload");
const productController = require("../controllers/ProductController")

// read product
productRouter.get("/:id?",(req,res)=>{
    const result= new productController().get(req.params.id,req.query)
    result.then(
        (success)=>{
            res.send(success);
        }
    ).catch(
        (error)=>{
            res.send(error);
        }
    )
})  
// read product

// images upload
productRouter.post("/multiple-image/:productId",fileUpload(
    {
        createParentPath:true
    }
),(req,res)=>{
        const result=new productController().multipleImage(req.params.productId,req.files.images);
        result.then(
            (success)=>{
                    res.send(success)
            }
        ).catch(
            (error)=>{
                res.send(error)
            }
        )
})
// images upload

// create product
productRouter.post("/create",fileUpload(
    {
        createParentPath:true
    }
),(req,res)=>{
        const result=new productController().create(req.body,req.files.thumbnail);
        result.then(
            (success)=>{
                    res.send(success)
            }
        ).catch(
            (error)=>{
                res.send(error)
            }
        )
})
// create product

//status change
productRouter.patch("/status",(req,res)=>{
    const result = new productController().status(req.body.id, req.body.flag);
    result.then(
        (success)=>{
            res.send(success)
        }
    ).catch(
        (error)=>{
            res.send(error)
        }
    )
})
//status change

// delete product
productRouter.delete("/delete/:id",(req,res)=>{
    const result= new productController().delete(req.params.id);
    result.then(
        (success)=>{
        res.send(success)
        }
    ).catch(
        (error)=>{
            res.send(error)
        }
    )
})
// delete product

// edit product
productRouter.put("/update/:id", fileUpload({
    createParentPath: true
}), (req, res) => {
    const result = new productController().update(req.params.id, req.body, req.files?.thumbnail);
    result.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    );
});
// edit product


module.exports = productRouter