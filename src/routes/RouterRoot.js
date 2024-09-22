import { Router } from "express";
import UserRouter from "./UserRouter.js";
import ProfessionalRouter from "./ProfessionalRouter.js";
import PersonalDataRouter from "./PersonalDataRouter.js";
import SoftSkillsRouter from "./SoftSkillsRouter.js";
import HardSkillsRouter from "./HardSkillsRouter.js";
import AcademicRouter from "./AcademicRouter.js";
import ProjectsRouter from "./ProjectsRouter.js";
import PortfolioRouter from "./PortfolioRouter.js";

export default class RouterRoot {
  constructor(db) {
    this.router = Router();
    this.userRouter = new UserRouter(db);
    this.professionalRouter = new ProfessionalRouter(db);
    this.personalDataRouter = new PersonalDataRouter(db);
    this.softSkillsRouter = new SoftSkillsRouter(db);
    this.hardSkillsRouter = new HardSkillsRouter(db);
    this.academicRouter = new AcademicRouter(db);
    this.projects = new ProjectsRouter(db);
    this.portfolio = new PortfolioRouter(
      db,
      this.professionalRouter.service,
      this.personalDataRouter.service,
      this.softSkillsRouter.service,
      this.hardSkillsRouter.service,
      this.academicRouter.service,
      this.projects.service
    );
  }

  initialize() {
    this.router.use("/users", this.userRouter.initialize());
    this.router.use("/professional", this.professionalRouter.initialize());
    this.router.use("/personal-data", this.personalDataRouter.initialize());
    this.router.use("/soft-skills", this.softSkillsRouter.initialize());
    this.router.use("/hard-skills", this.hardSkillsRouter.initialize());
    this.router.use("/academic", this.academicRouter.initialize());
    this.router.use("/projects", this.projects.initialize());
    this.router.use("/portfolio", this.portfolio.initialize());
    return this.router;
  }
}
