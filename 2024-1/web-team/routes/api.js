var express = require("express");
var router = express.Router();
var db = require("../config/db");
const bcrypt = require("bcrypt");
const memberApi = require("../api/member");

//인덱스 페이지 임시
require("dotenv").config();
const jwt = require("jsonwebtoken");

router.get("/", function (req, res, next) {
  res.send("info -> DISCORD API");
});

//인덱스페이지 - 나중에 분리
router.get("/home", function (req, res, next) {
  const token = req.header("Token");
  try {
    const verified = jwt.verify(token, process.env.ENV_SKEY);
  } catch {
    const emptyToken = {
      status: "null",
      msg: "토큰이 없거나 잘못 되었습니다.",
    };
    res.send(emptyToken);
  }
});

router.post("/login", memberApi.login);

router.post("/useid", memberApi.useid);

router.post("/register", memberApi.register);

router.post("/shop/add", function (req, res, next) {
  // 토큰검사
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

  // 정보추가
  res.send("ddd");
});

module.exports = router;
