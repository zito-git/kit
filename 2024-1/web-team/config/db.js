const mysql = require("mysql2");
const dbEnv = require("../config/env.json");

const connection = mysql.createConnection({
  host: dbEnv.host,
  user: dbEnv.user,
  database: dbEnv.database,
  password: dbEnv.password,
});

module.exports = { connection };
