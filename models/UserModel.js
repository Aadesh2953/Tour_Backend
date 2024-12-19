import mongoose from "mongoose"
import bcrypt from 'bcryptjs'
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
userModel.pre("save",async function(next)
{
   if(!this.isModified('password'))
{
    return next()
} 
this.password=await bcrypt.hash('password',12);
 console.log('password',this.password)
 next()
})
userModel.methods.isValidPassword= async function(userPass)
{
    console.log('userPass', userPass);
    console.log('stored password', this.password);
    let isValid = await bcrypt.compare(userPass, this.password);
    console.log('isValid', isValid);
    
//   console.log('pass',this.password,userPass)
//   return await bcrpyt.compare(this.password,userPass)

}
export const User=new mongoose.model("User",userModel)