const express=require("express");
const categoryRouter= express.Router();
const fileUpload = require ("express-fileupload")
const categoryController=require("../controllers/CategoryController");
const adminAuth = require("../Middleware/adminAuth");

// create category
categoryRouter.post("/create",
    [
        fileUpload(
            {
                createParentPath:true
            }
        ),
        adminAuth
    ]
,(req,res)=>{
    console.log(req?.headers?.authorization)
        const result=new categoryController().create(req.body,req.files.category_image);
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
// create category

// show category
categoryRouter.get("/:id?",(req,res)=>{
    const result = new categoryController().get(req.params.id)
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
// show category

// status update
categoryRouter.patch("/status/:id",(req,res)=>{
    const result = new categoryController().status(req.params.id);
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
// status update

// delete category
categoryRouter.delete("/delete/:id",(req,res)=>{
    const result= new categoryController().delete(req.params.id);
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
// delete category

// edit category
categoryRouter.put("/update/:id",fileUpload(
    {
        createParentPath:true
    }
),(req,res)=>{
        const result=new categoryController().update(req.params.id,req.body,req.files?.category_image);
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
// edit category

module.exports =categoryRouter;