import { Router } from "express";
import ProfessionalModel from "../model/ProfessionalModel.js";
import ProfessionalService from "../services/ProfessionalService.js";
import ProfessionalController from "../controllers/ProfessionalController.js";
import { auth } from "../middleware/auth.js";
import { minLength } from "../middleware/minLength.js";
import { isRequiredList } from "../middleware/isRequired.js";

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
    this.router.post(
      "/",
      minLength(1),
      isRequiredList(["company", "role", "description", "startDate"]),
      this.controller.create
    );
    this.router.get("/", this.controller.getByUserId);
    this.router.put(
      "/",
      minLength(1),
      isRequiredList(["company", "role", "description", "startDate"]),
      this.controller.update
    );
    return this.router;
  }
}
