const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function index(req, res, next) {
  const token = req.header("Token");
  try {
    const verified = jwt.verify(token, process.env.ENV_SKEY);
  } catch {
    const emptyToken = {
      status: "null",
      msg: "토큰이 없거나 잘못 되었습니다.",
    };
    return res.send(emptyToken);
  }
  db.connection.query("SELECT * FROM `camp`", function (err, results, fields) {
    return res.json(results);
  });
}

module.exports = { index };
