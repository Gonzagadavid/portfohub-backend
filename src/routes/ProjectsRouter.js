import { Router } from "express";
import ProjectsModel from "../model/ProjectsModel.js";
import ProjectsService from "../services/ProjectsService.js";
import ProjectsController from "../controllers/ProjectsController.js";
import { auth } from "../middleware/auth.js";
import { minLength } from "../middleware/minLength.js";
import { isRequiredList } from "../middleware/isRequired.js";

export default class ProjectsRouter {
  constructor(db) {
    this.router = Router();
    this.collection = db.collection("projects");
    this.model = new ProjectsModel(this.collection);
    this.service = new ProjectsService(this.model);
    this.controller = new ProjectsController(this.service);
  }

  initialize() {
    this.router.use(auth);
    this.router.post(
      "/",
      minLength(1),
      isRequiredList(["projectName", "link", "description"]),
      this.controller.create
    );
    this.router.get("/", this.controller.getByUserId);
    this.router.put(
      "/",
      minLength(1),
      isRequiredList(["projectName", "link", "description"]),
      this.controller.update
    );
    return this.router;
  }
}
