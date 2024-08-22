import { Router } from "express";
import { listUsers, userRegister } from "../../controllers/users/index.js";
import { isRequired } from "../../middleware/isRequired.js";

const userRouter = Router();

userRouter.get("/", listUsers);
userRouter.post(
  "/register",
  isRequired(["fullName", "email", "password"]),
  userRegister
);

export default userRouter;
