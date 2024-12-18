import mongoose from "mongoose"
import bcrpyt from 'bcryptjs'
export const userModel=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true,'A name is a required Field!!'],
        maxLength:[40,'username mustNot Exceed 40 characters'],
        minLength:[5,'username must be of length 5']
        
    },
    password:{
        type:String,
        required:[true,'A password is a required Field!!'],
        minLength:[true,'minLength must be of 8 characters']
       
    },
    confirmPassword:{
        type:String,
        required:[true,'A password is a required Field!!'],
        minLength:[true,'minLength must be of 8 characters']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'A Email is a required Field!!'],        
    },
    photo:String
})
userModel.pre("Save",async function(next)
{
   if(!this.isModified(this.password))
{
    return next()
} 
this.password=await bcrpyt.hash('password',12);
})
export const User=new mongoose.model("User",userModel)