import { MongoClient } from "mongodb";
const uri = process.env.DB_URI;
const dbName = process.env.DB_NAME;

let db = null;

const connection = () =>
  db
    ? Promise.resolve(db)
    : MongoClient.connect(uri).then((conn) => {
        db = conn.db(dbName);
        return db;
      });

export default connection;
