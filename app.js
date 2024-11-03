import express, { json } from "express"
import fs from "fs"
const app=express()
app.use(express.json({limit:"16kb"}))
const data=fs.readFileSync("./dev-data/data/tours-simple.json","utf-8")
let tours=JSON.parse(data);
app.get("/api/v1/getTours",(req,res)=>
{
    res.status(200).send({message:"Success",data:{tours}});
})
app.post("/api/v1/tours",(req,res)=>
{
    
    let id=tours.length+1;
    const newTour=Object.assign({},{id:id,data:req.body})
    tours.push(newTour)
    fs.writeFile("./dev-data/data/tours.json",JSON.stringify(tours),(data,err)=>
    {
        res.status(200).json({message:"Success",data:newTour})
    })
})
app.post("/api/v1/tour/:id/:x?",(req,res)=>
{
    //Here x is Optional
    const id=req.params?.id;
    console.log("params",req.params)
    if(id>tours.length)
    {
        res.status(404).send({success:false,message:"Tour Not Found!!!"})
    }
    const tour=tours.find((tour)=>tour.id==id)
    if(tour)
    {
       res.status(200).send({success:true,data:{...tour}})
    }
    else
    {
        res.status(404).send({success:false,message:"Tour Not Found!!!"})
    }
}
)
app.patch("/api/v1/tour/:id",(req,res)=>
{
    const id=req.params?.id;
    if(id>tours.length || isNaN(id) || id<1)
    {
        res.status(400).send({message:"Error Invalid ID!!!"})
    }
    else
    {
        let tourIndex=tours.findIndex((tour)=>tour.id==id)
        // if(tour)
        // {
        //     tour={...req.body,id:id};
        //     tours.splice(id,1,tour)
        //     console.log("tours",tours)
        //     res.status(200).json({message:"Success",data:{tour}})

        // }
        
        if(tourIndex)
            {
                tours[tourIndex]={...tours[tourIndex],...req.body,id:id};
                res.status(200).json({message:"Success",data:{tour:tours[tourIndex]}})
    
            }
    }
    }
)

app.delete("/api/v1/tour/:id",(req,res)=>
{
    const id=parseInt(req.params?.id)
   if(isNaN(id)|| id<1 || id>tours.length)
   {
     res.status(400).json({message:"Error Invalid Id"})
   }
   const findTour=tours.findIndex((tour)=>tour.id==id)
   if(findTour==-1)
   {
    res.status(400).json({message:"Error Invalid Id"})
   }
   const tour=tours.splice(findTour,1);
   res.status(201).json({message:"Success",data:{tour}})
})
app.listen(3000,()=>{
    console.log(`App Listening on http://localhost:3000`)
})