import connection from "./dbconnection.js";

export default class User {
  getUsers() {
    return [{ name: "David" }, { name: "Danielle" }];
  }

  async getUser(filter) {
    const db = await connection();
    return db.collection("users").findOne(filter);
  }

  async createUser(user) {
    const db = await connection();
    db.collection("users").insertOne(user);
  }
}
