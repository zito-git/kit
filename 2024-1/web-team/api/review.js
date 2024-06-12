const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function addReview(req, res, next) {
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

  const { camp_idx, comment, reservation_idx } = req.body;

  arr = [];
  for (let i = 0; i < req.files.length; i++) {
    arr.push("/assets/" + req.files[i].filename);
  }

  const listData = [camp_idx, reservation_idx, comment, JSON.stringify(arr)];

  console.log(listData);
  //글 작성
  const sql =
    "INSERT INTO `review` (`camp_idx`,`reservation_idx`,`comment`,`img`) VALUES (?,?,?,?)";

  db.connection.query(sql, listData, (err, result, fields) => {
    let result02 = {
      status: "success",
      msg: "등록완료",
    };
    return res.json(result02);
  });
}

function allReview(req, res, next) {
  const idx = req.query.idx;
  db.connection.query(
    "SELECT * FROM `review` WHERE `camp_idx`=?",
    idx,
    function (err, results, fields) {
      return res.json(results);
    }
  );
}

function myReview(req, res, next) {
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
  const idx = req.query.idx;
  db.connection.query(
    "SELECT * FROM `review` WHERE `reservation_idx`=?",
    idx,
    function (err, results, fields) {
      return res.json(results);
    }
  );
}

module.exports = { addReview, allReview, myReview };
