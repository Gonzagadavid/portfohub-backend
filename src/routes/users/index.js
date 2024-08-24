import { Router } from "express";
import {
  listUsers,
  userRegister,
  login
} from "../../controllers/users/index.js";
import { isRequired } from "../../middleware/isRequired.js";

const userRouter = Router();

userRouter.post("/login", login);
userRouter.get("/", listUsers);
userRouter.post(
  "/register",
  isRequired(["fullName", "email", "password"]),
  userRegister
);

export default userRouter;
