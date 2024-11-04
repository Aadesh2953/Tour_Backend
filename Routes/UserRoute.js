import { Router } from "express";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/UserController.js";
let userRouter = Router();
userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
export { userRouter };
