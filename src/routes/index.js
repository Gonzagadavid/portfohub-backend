import { Router } from "express";
import userRouter from "./users/index.js";
import professionalRouter from "./professional/index.js";

const rootRouter = Router();

rootRouter.use("/users", userRouter);
rootRouter.use("/professional", professionalRouter);

export default rootRouter;
