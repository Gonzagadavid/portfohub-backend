import { Router } from "express";
import UserRouter from "./UserRouter.js";
import ProfessionalRouter from "./ProfessionalRouter.js";
import PersonalDataRouter from "./PersonalDataRouter.js";

export default class RouterRoot {
  constructor(db) {
    this.router = Router();
    this.userRouter = new UserRouter(db);
    this.professionalRouter = new ProfessionalRouter(db);
    this.personalDataRouter = new PersonalDataRouter(db);
  }

  initialize() {
    this.router.use("/users", this.userRouter.initialize());
    this.router.use("/professional", this.professionalRouter.initialize());
    this.router.use("/personal-data", this.personalDataRouter.initialize());
    return this.router;
  }
}
