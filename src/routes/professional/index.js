import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import ProfessionalModel from "../../model/Professional.js";
import ProfessionalService from "../../services/professional/index.js";
import ProfessionalController from "../../controllers/professional/index.js";
import connection from "../../model/dbconnection.js";

const db = await connection();
const collection = db.collection("professional");
const professionalModel = new ProfessionalModel(collection);
const professionalService = new ProfessionalService(professionalModel);
const professionalController = new ProfessionalController(professionalService);
const professionalRouter = Router();

professionalRouter.use(auth);
professionalRouter.post("/", professionalController.create);

export default professionalRouter;
