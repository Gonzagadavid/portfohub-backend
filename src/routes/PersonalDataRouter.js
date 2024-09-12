import { Router } from "express";
import PersonalDataModel from "../model/PersonalDataModel.js";

import { auth } from "../middleware/auth.js";
import PersonalDataService from "../services/PersonalDataService.js";
import PersonalDataController from "../controllers/PersonalDataController.js";
import { isRequired } from "../middleware/isRequired.js";

export default class ProfessionalRouter {
  constructor(db) {
    this.router = Router();
    this.collection = db.collection("personal-data");
    this.model = new PersonalDataModel(this.collection);
    this.service = new PersonalDataService(this.model);
    this.controller = new PersonalDataController(this.service);
  }

  initialize() {
    this.router.use(auth);
    this.router.post(
      "/",
      isRequired([
        "fullName",
        "address",
        "description",
        "network",
        "email",
        "phrase"
      ]),
      this.controller.create
    );
    this.router.get("/", this.controller.getByUserId);
    this.router.put(
      "/",
      isRequired([
        "fullName",
        "address",
        "description",
        "network",
        "email",
        "phrase"
      ]),
      this.controller.update
    );
    return this.router;
  }
}
