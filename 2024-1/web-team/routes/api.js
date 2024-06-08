var express = require("express");
var router = express.Router();
var db = require("../config/db");
const bcrypt = require("bcrypt");
const memberApi = require("../api/member");
const homeApi = require("../api/home");
const shopApi = require("../api/camp");
const siteApi = require("../api/site");
const multer = require("multer");
const path = require("path");

//업로드 (multer)
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

// 메인페이지
router.get("/home", homeApi.index);

// 멤버페이지
router.post("/login", memberApi.login);

router.post("/useid", memberApi.useid);

router.post("/register", memberApi.register);

// 캠핑장 관련 (매장)
router.post("/camp/add", upload.array("image"), shopApi.addShopInfo);

router.get("/camp/select", shopApi.getIdxInfo);

router.post("/camp/update", shopApi.updateCampInfo);

// 캠핑장 사이트 관련
router.post("/site/add", upload.array("image"), siteApi.addSite);

router.get("/site/select", siteApi.selectSite);

router.get("/site/all", siteApi.allSite);

router.post("/site/update", siteApi.updateSite);

// 캠핑장 검색관련
router.get("/search", function (req, res, next) {
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
});

module.exports = router;
