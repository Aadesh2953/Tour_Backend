import { Router } from "express";
import {
  getAllUsers,
  // getUser,
  // updateUser,
  deleteUser,
  signUpUser,
  singInUser,
  forgotPassword,
  updatePassword,
  updateUser,
  updateExistingPassword,
  getLoggedInUser,

} from "../controllers/UserController.js";
import { restrictTo, verifyToken } from "../middlewares/AuthMiddleWare.js";
let userRouter = Router();
userRouter.route("/").get(verifyToken,getAllUsers);
userRouter.route("/signup").post(signUpUser);
userRouter.route("/signin").post(singInUser);
userRouter.route("/forgotPassword").post(forgotPassword)
userRouter.route("/resetPassword/:token").patch(updatePassword)
userRouter.use(verifyToken);
userRouter.route("/updateCurrentPassword").patch(verifyToken,updateExistingPassword)
userRouter.route("/updateUser").patch(verifyToken,restrictTo('user'),updateUser)
userRouter.route("/deleteUser").patch(verifyToken,restrictTo('admin'),deleteUser)
// userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
userRouter.route("/getUser").get(verifyToken,restrictTo('admin','user'),getLoggedInUser);
export { userRouter };
