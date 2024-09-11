import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import ProfessionalModel from "../../model/Professional.js";
import ProfessionalService from "../../services/professional/index.js";
import ProfessionalController from "../../controllers/professional/index.js";

export default class ProfessionalRouter {
  constructor(db) {
    this.router = Router();
    this.collection = db.collection("professional");
    this.model = new ProfessionalModel(this.collection);
    this.service = new ProfessionalService(this.model);
    this.controller = new ProfessionalController(this.service);
  }

  initialize() {
    this.router.use(auth);
    this.router.post("/", this.controller.create);
    this.router.get("/", this.controller.getByUserId);
    this.router.put("/", this.controller.update);
    return this.router;
  }
}
