import { Router } from "express";
import UserController from "../../controllers/users/index.js";
import { isRequired } from "../../middleware/isRequired.js";
import UserModel from "../../model/User.js";
import UserService from "../../services/users/index.js";
import connection from "../../model/dbconnection.js";

const db = await connection();
const collection = db.collection("users");
const userModel = new UserModel(collection);
const userService = new UserService(userModel);
const userController = new UserController(userService);
const userRouter = Router();

userRouter.post("/login", userController.login);
userRouter.post(
  "/register",
  isRequired(["fullName", "email", "password"]),
  userController.register
);

export default userRouter;
