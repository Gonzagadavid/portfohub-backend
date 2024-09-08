import connection from "./dbconnection.js";

export default class Professional {
  async createProfessionalInfo(info) {
    const db = await connection();
    db.collection("professional").insertOne(info);
  }
}
