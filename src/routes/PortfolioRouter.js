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
    this.router.get("/:pathname", this.controller.getPortfolio);

    this.router.use(auth);
    this.router.post("/pathname", this.controller.createPathname);

    return this.router;
  }
}
