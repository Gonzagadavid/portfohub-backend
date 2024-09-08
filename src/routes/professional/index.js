import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import professional from "../../controllers/professional/index.js";

const professionalRouter = Router();

professionalRouter.use(auth);
professionalRouter.post("/", professional);

export default professionalRouter;
