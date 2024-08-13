import { Router } from "express";
import { listUsers } from "../../controllers/users/index.js";

const userRouter = Router();

userRouter.get("/", listUsers);

export default userRouter;
