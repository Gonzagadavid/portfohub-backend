import { Router } from "express";
import UserRouter from "./UserRouter.js";
import ProfessionalRouter from "./ProfessionalRouter.js";

export default class RouterRoot {
  constructor(db) {
    this.router = Router();
    this.userRouter = new UserRouter(db);
    this.professionalRouter = new ProfessionalRouter(db);
  }

  initialize() {
    this.router.use("/users", this.userRouter.initialize());
    this.router.use("/professional", this.professionalRouter.initialize());
    return this.router;
  }
}
