import App from "./app/App.js";
import connection from "./model/dbConnection.js";
import RouterRoot from "./routes/RouterRoot.js";

const db = await connection();
const router = new RouterRoot(db);
const app = new App(router);

app.startServer();

