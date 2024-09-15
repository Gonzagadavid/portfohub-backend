import { Router } from "express";
import HardSkillsModel from "../model/HardSkillsModel.js";
import HardSkillsService from "../services/HardSkillsService.js";
import HardSkillsController from "../controllers/HardSkillsController.js";
import { auth } from "../middleware/auth.js";

export default class HardSkillsRouter {
  constructor(db) {
    this.router = Router();
    this.collection = db.collection("hardSkills");
    this.model = new HardSkillsModel(this.collection);
    this.service = new HardSkillsService(this.model);
    this.controller = new HardSkillsController(this.service);
  }

  initialize() {
    this.router.use(auth);
    this.router.post("/", this.controller.create);
    this.router.get("/", this.controller.getByUserId);
    this.router.put("/", this.controller.update);
    return this.router;
  }
}
