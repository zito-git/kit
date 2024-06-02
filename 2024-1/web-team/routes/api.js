var express = require("express");
var router = express.Router();
var db = require("../config/db");
const bcrypt = require("bcrypt");
const memberApi = require("../api/member");
const homeApi = require("../api/home");

//인덱스 페이지 임시
require("dotenv").config();
const jwt = require("jsonwebtoken");

router.get("/", function (req, res, next) {
  res.send("info -> DISCORD API");
});

//인덱스페이지
router.get("/home", homeApi.index);

//멤버페이지
router.post("/login", memberApi.login);

router.post("/useid", memberApi.useid);

router.post("/register", memberApi.register);

router.post("/seller/reservation", memberApi.register);

//판매자(seller)페이지

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

  // const {
  //   name,
  //   address,
  //   phone,
  //   intro,
  //   check_in,
  //   check_out,
  //   charge,
  //   member,
  //   area_info,
  // } = req.body;

  // 정보추가
  res.send("ddd");
});

module.exports = router;
