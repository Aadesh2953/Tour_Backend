import express, { json } from "express"
import fs from "fs"
const app=express()
app.use(express.json({limit:"16kb"}))
const data=fs.readFileSync("./dev-data/data/tours.json","utf-8")
app.get("/api/v1/getTours",(req,res)=>
{
    res.status(200).send({message:"Success",data:{data}});
})
app.post("/api/v1/tours",(req,res)=>
{
    let tours=JSON.parse(data);
    let id=tours.length+1;
    const newTour=Object.assign({},{id:id,data:req.body})
    tours.push(newTour)
    fs.writeFile("./dev-data/data/tours.json",JSON.stringify(tours),(data,err)=>
    {
        res.status(200).json({message:"Success",data:newTour})
    })
})
app.listen(3000,()=>{
    console.log(`App Listening on http://localhost:3000`)
})