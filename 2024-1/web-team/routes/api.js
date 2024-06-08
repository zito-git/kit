var express = require("express");
var router = express.Router();
var db = require("../config/db");
const bcrypt = require("bcrypt");
const memberApi = require("../api/member");
const homeApi = require("../api/home");
const shopApi = require("../api/shop");
const multer = require("multer");
const path = require("path");

//업로드
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets"); // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, new Date().valueOf() + path.extname(file.originalname)); // cb 콜백함수를 통해 전송된 파일 이름 설정
  },
});

const upload = multer({
  dest: "public/assets",
  storage: storage,
});

//토큰검사 임시
require("dotenv").config();
const jwt = require("jsonwebtoken");

router.get("/", function (req, res, next) {
  res.send("info -> DISCORD API");
});

//
router.get("/home", homeApi.index);

//멤버페이지
router.post("/login", memberApi.login);

router.post("/useid", memberApi.useid);

router.post("/register", memberApi.register);

// 매장
router.post("/shop/add", upload.array("image"), shopApi.addShopInfo);

router.post("/shop/select", shopApi.getIdxInfo);

module.exports = router;
