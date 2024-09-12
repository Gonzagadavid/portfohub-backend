import { Router } from "express";
import { isRequired } from "../middleware/isRequired.js";
import UserModel from "../model/UserModel.js";
import UserService from "../services/UserService.js";
import UserController from "../controllers/UserController.js";

export default class UserRouter {
  constructor(db) {
    this.router = Router();
    this.collection = db.collection("users");
    this.model = new UserModel(this.collection);
    this.service = new UserService(this.model);
    this.controller = new UserController(this.service);
  }

  initialize() {
    this.router.post("/login", this.controller.login);
    this.router.post(
      "/register",
      isRequired(["fullName", "email", "password"]),
      this.controller.register
    );

    return this.router;
  }
}