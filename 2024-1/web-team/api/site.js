const bcrypt = require("bcrypt");
const db = require("../config/db");
require("dotenv").config();
const jwt = require("jsonwebtoken");

function addSite(req, res, next) {
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

  const { category, site, charge, member_count, status } = req.body;

  arr = [];
  for (let i = 0; i < req.files.length; i++) {
    arr.push("/assets/" + req.files[i].filename);
  }
  console.log(arr);
  console.log(req.files);

  //인덱스번호로 변경해야함
  //인덱스번호로 변경해야함
  //인덱스번호로 변경해야함

  const listData = [
    jwt.decode(token).username,
    category,
    site,
    charge,
    member_count,
    status,
    JSON.stringify(arr),
  ];

  console.log(listData);
  //글 작성
  const sql =
    "INSERT INTO `site` (`shop_id`,`category`,`site`,`charge`,`member_count`,`status`,`img`) VALUES (?,?,?,?,?,?,?)";

  db.connection.query(sql, listData, (err, result, fields) => {
    let result02 = {
      status: "success",
      msg: "등록완료",
    };
    return res.json(result02);
  });
}

function selectSite(req, res, next) {
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
    "SELECT * FROM `site` WHERE `idx`=?",
    idx,
    function (err, results, fields) {
      return res.json(results[0]);
    }
  );
}

function allSite(req, res, next) {
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

  const shop = req.query.shop_id;

  db.connection.query(
    "SELECT * FROM `site` WHERE `shop_id`=?",
    shop,
    function (err, results, fields) {
      return res.json(results);
    }
  );
}

function updateSite(req, res, next) {
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

  const { idx, shop_id, category, site, charge, member_count, status } =
    req.body;

  const listData = [
    jwt.decode(token).username,
    category,
    site,
    charge,
    member_count,
    status,
    idx, // idx 값
  ];

  const sql = `
        UPDATE \`site\`
        SET
          shop_id=?,
          category = ?, 
          site = ?, 
          charge = ?, 
          member_count = ?, 
          status = ?
        WHERE idx = ?
      `;
  db.connection.query(sql, listData, function (err, results, fields) {
    return res.json(results);
  });
}

module.exports = { addSite, selectSite, allSite, updateSite };
