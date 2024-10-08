import { Router } from "express";

import PortfolioModel from "../model/PortfolioModel.js";
import PortfolioService from "../services/PortfolioService.js";
import PortfolioController from "../controllers/PortfolioController.js";
import { auth } from "../middleware/auth.js";

export default class PortfolioRouter {
  constructor(
    db,
    professionalService,
    personalDataService,
    softSkillsService,
    hardSkillsService,
    academicService,
    projectService
  ) {
    this.router = Router({ mergeParams: true });
    this.collection = db.collection("portfolio");
    this.model = new PortfolioModel(this.collection);
    this.service = new PortfolioService(
      this.model,
      professionalService,
      personalDataService,
      softSkillsService,
      hardSkillsService,
      academicService,
      projectService
    );
    this.controller = new PortfolioController(this.service);
  }

  initialize() {
    this.router.get("/data/:pathname", this.controller.getPortfolio);
    this.router.head(
      "/pathname-is-used/:pathname",
      this.controller.pathnameIsUsed
    );

    this.router.use(auth);
    this.router.get("/portfolio-data", this.controller.getDataPortfolio);
    this.router.get("/info", this.controller.getPortfolioInfo);
    this.router.post("/pathname", this.controller.createPathname);
    this.router.get("/pathname", this.controller.getPathname);
    this.router.put("/template", this.controller.addOrUpdateTemplate);
    this.router.get("/requirements", this.controller.getCheckInfo);

    return this.router;
  }
}
