import { Router } from "express";
import {
  // getAllUsers,
  // getUser,
  // updateUser,
  // deleteUser,
  signUpUser,
} from "../controllers/UserController.js";
let userRouter = Router();
userRouter.route("/signup").post(signUpUser);
// userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
export { userRouter };
