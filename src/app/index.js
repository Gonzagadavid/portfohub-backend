import express from "express";
import cors from "cors";
import rootRouter from "../routes/index.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/", rootRouter);

app.listen(3002, () => {
  console.log("Running... 3002");
});
