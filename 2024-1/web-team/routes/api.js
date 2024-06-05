var express = require("express");
var router = express.Router();
var db = require("../config/db");
const bcrypt = require("bcrypt");
const memberApi = require("../api/member");
const homeApi = require("../api/home");

const multer = require("multer");

const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets"); // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, new Date().valueOf() + path.extname(file.originalname)); // cb 콜백함수를 통해 전송된 파일 이름 설정
  },
});

const upload = multer({
  dest: "public/assets/",
  storage: storage,
});

router.post("/upload", upload.single("image"), function (req, res, next) {
  console.log(req.file);
  console.log(req.body);
  res.send("OK");
});

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

// router.post("/seller/reservation", memberApi.register);

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
