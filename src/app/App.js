import express from "express";
import cors from "cors";
import { handlerError } from "../middleware/error.js";

const { PORT = 3002 } = process.env;
const origin = "*";

const started = (port) => `Running... ${port}`;

class App {
  constructor(router) {
    this.app = express();
    this.app.use(cors({ origin }));
    this.app.use(express.json());
    this.router = router.initialize();
  }

  startServer(port) {
    const actualPort = PORT || port;
    try {
      this.app.use(this.router);
      this.app.use(handlerError);
      this.app.listen(actualPort, () => console.log(started(actualPort)));
    } catch (err) {
      console.log(err);
    }
  }
}

export default App;
