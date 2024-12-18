import { User } from "../models/UserModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
// export const getAllUsers = (req, res) => {
//   res.status(500).json({ success: "false", message: "Invalid Route " });
// };
// export const getUser = (req, res) => {
//   res.status(500).json({ success: "false", message: "Invalid Route " });
// };
// export const updateUser = (req, res) => {
//   res.status(500).json({ success: "false", message: "Invalid Route " });
// };
// export const deleteUser = (req, res) => {
//   res.status(500).json({ success: "false", message: "Invalid Route " });
// };
export const signUpUser = asyncHandler(async (req, res, next) => {
  console.log("body", req.body);
  let newUser =  await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
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
