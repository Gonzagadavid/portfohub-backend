import { Router } from "express";
import AcademicModel from "../model/AcademicModel.js";
import AcademicService from "../services/AcademicService.js";
import AcademicController from "../controllers/AcademicController.js";
import { auth } from "../middleware/auth.js";

export default class AcademicRouter {
  constructor(db) {
    this.router = Router();
    this.collection = db.collection("academic");
    this.model = new AcademicModel(this.collection);
    this.service = new AcademicService(this.model);
    this.controller = new AcademicController(this.service);
  }

  initialize() {
    this.router.use(auth);
    this.router.post("/", this.controller.create);
    this.router.get("/", this.controller.getByUserId);
    this.router.put("/", this.controller.update);
    return this.router;
  }
}
