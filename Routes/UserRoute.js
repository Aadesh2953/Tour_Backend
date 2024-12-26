import { Router } from "express";
import {
  getAllUsers,
  // getUser,
  // updateUser,
  // deleteUser,
  signUpUser,
  singInUser,
  forgotPassword,
  updatePassword,
} from "../controllers/UserController.js";
let userRouter = Router();
userRouter.route("/").get(getAllUsers);
userRouter.route("/signup").post(signUpUser);
userRouter.route("/signin").post(singInUser);
userRouter.route("/forgotPassword").post(forgotPassword)
userRouter.route("/resetPassword/:token").patch(updatePassword)
// userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
export { userRouter };
