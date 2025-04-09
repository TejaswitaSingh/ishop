const express=require("express");
const colorRouter= express.Router();
const colorController=require("../controllers/ColorController")

// create color
colorRouter.post("/create",(req,res)=>{
        const result=new colorController().create(req.body);
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
// create color

// show color
colorRouter.get("/:id?",(req,res)=>{
    const result = new colorController().get(req.params.id)
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
// show color

// status update
colorRouter.patch("/status/:id",(req,res)=>{
    const result = new colorController().status(req.params.id);
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

// delete color
colorRouter.delete("/delete/:id",(req,res)=>{
    const result= new colorController().delete(req.params.id);
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
// delete color

// edit color
colorRouter.put("/update/:id",(req,res)=>{
        const result=new colorController().update(req.params.id,req.body);
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
// edit color

module.exports =colorRouter;