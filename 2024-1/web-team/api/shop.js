const bcrypt = require("bcrypt");
const db = require("../config/db");
require("dotenv").config();
const jwt = require("jsonwebtoken");

function addShopInfo(req, res, next) {
  // 토큰검사
  // const token = req.header("Token");
  // try {
  //   const verified = jwt.verify(token, process.env.ENV_SKEY);
  // } catch {
  //   const emptyToken = {
  //     status: "null",
  //     msg: "토큰이 없거나 잘못 되었습니다.",
  //   };
  //   return res.send(emptyToken);
  // }

  const {
    name,
    site,
    address,
    phone,
    intro,
    check_in,
    check_out,
    charge,
    member,
    area_info,
  } = req.body;

  arr = [];
  for (let i = 0; i < req.files.length; i++) {
    arr.push("/assets/" + req.files[i].filename);
  }

  const listData = [
    name,
    site,
    address,
    phone,
    intro,
    check_in,
    check_out,
    charge,
    member,
    JSON.stringify(area_info),
    JSON.stringify(arr),
  ];

  console.log(listData);
  //글 작성
  const sql =
    "INSERT INTO `camp`(`c_name`, `c_site`, `c_address`, `c_phone`,`c_intro`,`c_check_in`,`c_check_out`,`c_charge`,`c_member_count`,`c_area_info`,`c_img`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

  db.connection.query(sql, listData, (err, result, fields) => {
    let result02 = {
      status: "success",
      msg: "등록완료",
    };
    return res.json(result02);
  });

  // res.send("OK");
}

function getIdxInfo(req, res, next) {
  const idx = req.body.idx;
  console.log(idx);
  db.connection.query(
    "SELECT * FROM `camp` WHERE `idx` = ?",
    idx,
    function (err, results, fields) {
      return res.json(results[0]);
    }
  );
}

module.exports = { addShopInfo, getIdxInfo };
