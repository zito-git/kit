var express = require("express");
var router = express.Router();
var db = require("../config/db");

router.get("/login", function (req, res, next) {
  // db.connection.query("SELECT * FROM member", function (err, results, fields) {
  //   console.log(results);
  // });
  res.send("O");
});

router.post("/register", function (req, res, next) {
  const r = req.body;
  const arr = [r.nickname, r.userid, r.userpw, r.role];

  const resultJson = {
    nickname: arr[0],
    userid: arr[1],
    userpw: arr[2],
    role: arr[3],
  };

  res.json(resultJson);
});

module.exports = router;
