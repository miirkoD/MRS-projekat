import { Database } from "arangojs";

const db = new Database({
  url: process.env.ARANGO_URL || "http://127.0.0.1:8529",
  auth: {
    username: process.env.ARANGO_USER || "root",
    password: process.env.ARANGO_PASS || "",
  },
});

const database = db.database(process.env.ARANGO_DB || "calendar");

export default database;