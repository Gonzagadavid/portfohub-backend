import { Router } from "express";
import SoftSkillsModel from "../model/SoftSkillsModel.js";
import SoftSkillsService from "../services/SoftSkillsService.js";
import SoftSkillsController from "../controllers/SoftSkillsController.js";
import { auth } from "../middleware/auth.js";

export default class SoftSkillsRouter {
  constructor(db) {
    this.router = Router();
    this.collection = db.collection("softSkills");
    this.model = new SoftSkillsModel(this.collection);
    this.service = new SoftSkillsService(this.model);
    this.controller = new SoftSkillsController(this.service);
  }

  initialize() {
    this.router.use(auth);
    this.router.post("/", this.controller.create);
    this.router.get("/", this.controller.getByUserId);
    this.router.put("/", this.controller.update);
    return this.router;
  }
}
