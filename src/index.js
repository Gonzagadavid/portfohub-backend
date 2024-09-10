import App from "./app/index.js";
import rootRouter from "./routes/index.js";

const app = new App();

app.addRouter(rootRouter);

app.startServer();
