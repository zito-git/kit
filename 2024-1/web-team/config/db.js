const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.ENV_HOST,
  user: process.env.ENV_USER,
  database: process.env.ENV_DB,
  password: process.env.ENV_PASS,
  port: process.env.ENV_PORT,
});

module.exports = { connection };
