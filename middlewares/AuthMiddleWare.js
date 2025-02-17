import { User } from "../models/UserModel.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
export const verifyToken=asyncHandler(async(req,res,next)=>
{
    if(!req.headers || !req.headers.authorization)
    {
       return next(new ApiError(401,'Pls login to Access This Route!!!'));   
    }
    const reqToken=req.headers.authorization.split(' ')[1];
        if(!reqToken)
        {
         return next(new ApiError(401,'Pls login to Access This Route!!!'));
        }
     const decodedToken= jwt.verify(reqToken,process.env.JWT_SECRET);
    
     if(!decodedToken)
    {
        return next(new ApiError(401,'Token not Found'))
    }
    const user=await User.findById(decodedToken.id);
    if(!user)
    {
        return next(new ApiError(401,'User with This User Id Does Not Exist!!!'));
    }
   if(user.isPasswordUpdated())
   {
    return next(new ApiError(401,'Password Updated Please Login Again to Continue!!'));
   }
    req.user=user
    next();

})
export const restrictTo=(...roles)=>
{
    return (req,res,next)=>{
     
        if(!roles|| !roles.includes(req.user?.role))
        {
            return next(new ApiError(403,'You are not Authorized to Access this Route!!'))
        }
        next();
    }
}