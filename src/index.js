import App from "./app/index.js";
import connection from "./model/dbconnection.js";
import RouterRoot from "./routes/index.js";

const db = await connection();
const router = new RouterRoot(db);
const app = new App(router);

app.startServer();