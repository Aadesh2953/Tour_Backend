import { User } from "../models/UserModel.js";
import ApiError from "../utils/ApiError.js";
import crypto from "crypto";
// import { sendEmail } from "../utils/email.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { filteredUser } from "../utils/filteredFiedls.js";
import {deleteOne,updateOne,createOne,getOne,readAll} from '../utils/factoryFunctions.js'
import { Email } from "../utils/email.js";
import { Tour } from "../models/TourModel.js";
import jwt from "jsonwebtoken";
import ApiFeature from "../utils/FilteredQuery.js";
import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";
import { Bookings } from "../models/BookingModel.js";
const filteredBody = (body, key) => {
  for (let elements in body) {
    if (elements[key]) delete elements[key];
  }
  return body;
};
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password -confirmPassword");
  res.status(201).json({
    message: "Success",
    length: users.length,
    data: users,
  });
});
export const getJWTToken = (id) => {
  const JWTtoken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: Date.now() + process.env.JWT_EXPIRES_IN * 1000 * 60 * 60,
  });
  return JWTtoken;
};
export const singInUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(process.env.STRIPE_SECRET_KEY);
  if (!email  || !password) {
    return next(new ApiError(404, "Please enter a valid Email or Password"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError(400, "User Not Found"));
  }

  let isValidPassword = await user.isPasswordCorrect(password);

  if (!isValidPassword) {
    return next(new ApiError(400, "Please Enter Your Password Correctly"));
  }

  const token = getJWTToken(user._id); // Function to generate token
  let options = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // httpOnly:true,
    // secure:true,
  };
  res.cookie("jwt", token, options);
  res.status(201).json({
    success:true,
    message: "Success",
    token,
    user,
  });
});

export const signUpUser = asyncHandler(async (req, res, next) => {
  // console.log('files',req.file);
  const existingUser = await User.findOne({$or:[{ email: req.body.email },{name:req.body.name}]});
  if (existingUser) return next(new ApiError(401, "User Already Exists"));
  let imageUrl;
  if(req.file)
  {
    imageUrl=await uploadOnCloudinary(req.file.path);
  }
  let newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    confirmPassword: req.body.confirmPassword,
    photo:imageUrl
  });
   Promise.all([new Email(newUser, `${req.protocol}://${req.get('host')}/me`).sendWelcome()]);
  const token = getJWTToken(newUser._id);
  let options = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 1000 * 60 * 60
    ),
    // httpOnly:true,
    // secure:true,
  };
  res.cookie("jwt", token, options);
  res.status(201).json({
    message: "User Successfully Created",
    user: newUser,
    token,
    status: "Success",
  });
});
export const forgotPassword = asyncHandler(async (req, res, next) => {
  
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return next(new ApiError(404, "User Not Found With This Email!!"));
  }
  const generateToken = await user.createPasswordResetToken();
  const resetUrl = `${req.protocol}://${req.get('host')}/forgotPassword/${generateToken}`;
// const message = `Forgot Your Password? No worries Click on the link below to reset your password!! <br/> ${resetUrl}`;
 await new Email(user,resetUrl).sendResetPassword(); 
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    message: "Token Sent to Email!!",
    status: "Success",
  });
});
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const token = req.params?.token;
  // console.log('token',token)
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // console.log('hashed',hashedToken)
  let user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!token) return next(new ApiError(404, "Token Not Found!!"));
  if (!user)
    return next(
      new ApiError(404, "Token Not Found!! or Token must have Expired!!!")
    );
  if (!password)
    return next(
      new ApiError(
        404,
        "Please Enter a Password!! in order to Reset  a  password"
      )
    );
  if (!confirmPassword)
    return next(
      new ApiError(
        404,
        "Please Enter a Confirm Password!! in order to Reset  a  password"
      )
    );
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  const newToken = getJWTToken(user._id);
  await user.save({ validateBeforeSave: true });
  let options = {
    expiresIn: process.env.JWT_EXPIRES_IN,
  };
  res.cookie("jwt", token, options);
  res.status(201).json({
    message: "Password Reset Successfully",
    token: newToken,
    status: "Success",
  });
});
export const updateExistingPassword = asyncHandler(async (req, res, next) => {
  if(req.body.currentPassword==req.body.password)next(new ApiError(400,'Old and New Passwords are same!!'))
  const user = await User.findById(req.user?.id).select("+password");
  if (!user) return next(new ApiError(404, "user Not Found!!!"));
  if (!(await user.isPasswordCorrect(req.body?.currentPassword))) {
    return next(new ApiError(404, "Password InCorrect!!!"));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  const newToken = getJWTToken(user._id);
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    success:true,
     user,
    newToken,
  });
});
export const updateUser = asyncHandler(async (req, res, next) => {
  // if(!req.body)return next(new ApiError(401,'Please Provide some body'));
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new ApiError(
        404,
        "For Resetting Password you can go to Update Password!!!"
      )
    );
  }
  const user = await User.findById(req.user?.id);
  if (!user) {
    return next(new ApiError(404, "User Not Found!!!"));
  }
  let url
  if(req.file && req.file.path){
    url=await uploadOnCloudinary(req.file.path)
  }
  // console.log('url')
  const body = filteredBody(req.body, "role");
  // console.log('body',body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { ...body,photo:url},
    { new: true, runValidators: true }
  );
  res.status(200).json({
    message: "Success!",
    user: updatedUser,
  });
});
export const deleteUser = asyncHandler(async (req, res, next) => {
  let user = await User.deleteOne({email:'tp1234@yopmail.com'});
  if (!user) {
    return next(new ApiError(401, "User Not Found!!!"));
  }
  res.status(201).send({
    status: "Success",
    message: "User Deleted Successfully",
  });
});
export const getLoggedInUser=asyncHandler(async(req,res,next)=>
{
  let userId=req.user._id;
  const user=await User.findById(userId).select(filteredUser());
  res.status(200).send({
    status:"Success",
    message:"user Found Successfully!!",
  data:user,
  })
})
export const getMyTours=asyncHandler(async(req,res,next)=>{
  const userId=req.user._id;
   let feature=new ApiFeature(Tour.find({createdBy:userId}),req.query);
   let MyTours =await feature.query;
   let hasNext=false
   if(req.query?.page) hasNext=MyTours.length<req.query?.page*1*req.query?.limit*1?false:true;
   res.status(200).send({
    success:true,
    MyTours,
    hasNext,
    status:"success"
   })
   
})
export const getMyBookings=asyncHandler(async(req,res,next)=>{
  const myBookings=await Bookings.find({user:req.user.id});
  if(myBookings.length==0)
  {
    res.status(200).send({
      success:true,
      message:"No Bookings to Display Here Book a tour Now"
    })
  }
  res.status(200).send({
    items:myBookings.length,
    success:true,
    data:myBookings,
  })
  
})