import { Router } from "express";
import userRouter from "./users/index.js";

const rootRouter = Router();

rootRouter.use("/users", userRouter);

export default rootRouter;
