import express, { json } from "express"
import fs from "fs"
const app=express()
const data=fs.readFileSync("./dev-data/data/tours.json","utf-8")
app.get("/",(req,res)=>
{
    res.status(200).send({message:"Success",data:{data}});
})
app.listen(3000,()=>{
    console.log(`App Listening on http://localhost:8000`)
})