import { User } from "../models/UserModel.js";
import ApiError from "../utils/ApiError.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
const filteredBody=(body,key)=>
{
  for(let elements in body)
  {
    if(elements[key])delete elements[key];
  }
  return body;
}
export const getAllUsers=asyncHandler(async(req,res,next)=>{
  const users=await User.find().select("-password -confirmPassword");
  res.status(201).json({
    message:"Success",
    length:users.length,
    data:users,
  })
})
export const getJWTToken=(id)=>
  {
    const JWTtoken=jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
    return JWTtoken;
  }
  export const singInUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ApiError(404, 'Please enter a valid Email or Password'));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ApiError(400, 'User Not Found'));
    }

    let isValidPassword = await user.isPasswordCorrect(password);

    if (!isValidPassword) {
        return next(new ApiError(400, 'Please Enter Your Password Correctly'));
    }

    const token = getJWTToken(user._id);  // Function to generate token

    res.status(201).json({
        message: 'Success',
        token,
        user
    });
});


export const signUpUser = asyncHandler(async (req, res, next) => {
  let newUser =  await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role:req.body.role,
    confirmPassword: req.body.confirmPassword,
  })
  newUser = await User.findById(newUser._id).select('-password -confirmPassword');
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(201).json({
    message: "User Successfully Created",
    user:newUser,
    token,
    status: "Success",
  });
});
export const forgotPassword=asyncHandler(async(req,res,next)=>
{
  const userEmail=req.body.email;
   const user= await User.findOne({email:userEmail});
   if(!user)
   {
    return next(new ApiError(404,'User Not Found With This Email!!'));
   }
   const generateToken=await user.createPasswordResetToken();
   const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${generateToken}`;
   const message=`Forgot Your Password? No worries Click on the link below to reset your password!! <br/> ${resetUrl}`;
   const options={
    email:userEmail,
    text:message,
    subject:"Password Reset Token"
   }
   await sendEmail(options);
   await user.save({validateBeforeSave:false});
   res.status(200).json({
     message:"Token Sent to Email!!",
     status:"Success"
   })

  })
 export const updatePassword=asyncHandler(async(req,res,next)=>
  {
    const {password,confirmPassword}=req.body;
    const token=req.params?.token;
    // console.log('token',token)
    const hashedToken=crypto.createHash("sha256").update(token).digest("hex");
    // console.log('hashed',hashedToken)
    let user=await User.findOne({passwordResetToken:hashedToken,passwordResetTokenExpires:{$gt:Date.now()}});
    if(!token)  return next(new ApiError(404,'Token Not Found!!'));
    if(!user) return next(new ApiError(404,'Token Not Found!! or Token must have Expired!!!'));
    if(!password)return next(new ApiError(404,'Please Enter a Password!! in order to Reset  a  password'));
    if(!confirmPassword)return next(new ApiError(404,'Please Enter a Confirm Password!! in order to Reset  a  password'));
    user.password=password;
    user.confirmPassword=confirmPassword;
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpires=undefined;
    const newToken=getJWTToken(user._id);
    await user.save({validateBeforeSave:true});
    res.status(201).json({
      message:"Password Reset Successfully",
      token:newToken,
      status:"Success"
  })
})
export const updateExistingPassword=asyncHandler(async(req,res,next)=>
{
  const user=await User.findById(req.user?.id).select('+password');
  if(!user) return next(new ApiError(404,'user Not Found!!!'));
  if(!await user.isPasswordCorrect(req.body?.currentPassword))
  {
     return next(new ApiError(404,'Password InCorrect!!!'));
  }
  user.password=req.body.password;
  user.confirmPassword=req.body.confirmPassword;
  const newToken=getJWTToken(user._id);
  await user.save({validateBeforeSave:false});
  res.status(200).json({
    data:user,
    newToken
  })
})
export const updateUser=asyncHandler(async(req,res,next)=>
{

  // if(!req.body)return next(new ApiError(401,'Please Provide some body'));
  if(req.body.password||req.body.confirmPassword)
  {
    return next(new ApiError(404,'For Resetting Password you can go to Update Password!!!'));
  }
  const user=await User.findById(req.user?.id);
  if(!user)
  {
    return next(new ApiError(404,'User Not Found!!!'));
  }
  const body=filteredBody(req.body,'role')
  const updatedUser=await User.findByIdAndUpdate(req.user.id,{...body},{new:true,runValidators:true});
  res.status(200).json({
    message:"Success!",
    user:updatedUser
  })
})