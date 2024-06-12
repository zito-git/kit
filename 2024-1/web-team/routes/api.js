var express = require("express");
var router = express.Router();
var db = require("../config/db");
const bcrypt = require("bcrypt");
const memberApi = require("../api/member");
const homeApi = require("../api/home");
const shopApi = require("../api/camp");
const siteApi = require("../api/site");
const reviewApi = require("../api/review");
const reservation = require("../api/reservation");
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

router.get("/camp/all", shopApi.getCampAll);

router.post("/camp/update", shopApi.updateCampInfo);

// 추가사항
router.get("/camp/shop_site", shopApi.getCampId);

router.get("/camp/shop_list", shopApi.getShopToken);

// 추가사항  캠핑장 본인(사장)이 맞는지 확인
router.get("/camp/mycamp", shopApi.isOkCamp);

// 캠핑장 검색관련
router.get("/camp/search", shopApi.search);

// 캠핑장 사이트 관련
router.post("/site/add", upload.array("image"), siteApi.addSite);

router.get("/site/select", siteApi.selectSite);

router.get("/site/all", siteApi.allSite);

router.post("/site/update", siteApi.updateSite);

// 리뷰 관련
router.post("/review/add", upload.array("image"), reviewApi.addReview);

router.get("/review/all", reviewApi.allReview);

router.get("/review/myreview", reviewApi.myReview);

// 예약 관련
router.post("/res", reservation.isResOk);

router.post("/res/submit", reservation.resSubmit);

router.post("/res/define", reservation.resAdminChange);

router.post("/res/mypage", reservation.showMypage);

module.exports = router;
