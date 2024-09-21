import { Router } from "express";

import PortfolioModel from "../model/PortfolioModel.js";
import PortfolioService from "../services/PortfolioService.js";
import PortfolioController from "../controllers/PortfolioController.js";
import { auth } from "../middleware/auth.js";

export default class PortfolioRouter {
  constructor(db) {
    this.router = Router();
    this.collection = db.collection("portfolio");
    this.model = new PortfolioModel(this.collection);
    this.service = new PortfolioService(this.model);
    this.controller = new PortfolioController(this.service);
  }

  initialize() {
    this.router.use(auth);
    this.router.post("/", this.controller.createPathname);

    return this.router;
  }
}
