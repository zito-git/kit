const bcrypt = require("bcrypt");
const db = require("../config/db");
require("dotenv").config();
const jwt = require("jsonwebtoken");

function addShopInfo(req, res, next) {
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

  const {
    name,
    category,
    address,
    phone,
    intro,
    check_in,
    check_out,
    area_info,
  } = req.body;

  arr = [];
  for (let i = 0; i < req.files.length; i++) {
    arr.push("/assets/" + req.files[i].filename);
  }
  console.log(arr);

  const listData = [
    jwt.decode(token).username,
    JSON.stringify(category),
    name,
    address,
    phone,
    intro,
    check_in,
    check_out,
    JSON.stringify(area_info),
    JSON.stringify(arr),
  ];

  console.log(listData);
  //글 작성
  const sql =
    "INSERT INTO `camp` (`c_shop_id`,`c_category`,`c_name`, `c_address`, `c_phone`,`c_intro`,`c_check_in`,`c_check_out`,`c_area_info`,`c_img`) VALUES (?,?,?,?,?,?,?,?,?,?)";

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
  console.log(idx);
  db.connection.query(
    "SELECT * FROM `camp` WHERE `idx` = ?",
    idx,
    function (err, results, fields) {
      return res.json(results[0]);
    }
  );
}

function updateCampInfo(req, res, next) {
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

  const {
    idx,
    category,
    name,
    address,
    phone,
    intro,
    check_in,
    check_out,
    area_info,
  } = req.body;

  const listData = [
    jwt.decode(token).username,
    JSON.stringify(category),
    name,
    address,
    phone,
    intro,
    check_in,
    check_out,
    JSON.stringify(area_info),
    idx, // idx 값
  ];

  const sql = `
        UPDATE \`camp\`
        SET
          c_shop_id=?,
          c_category=?,
          c_name = ?, 
          c_address = ?, 
          c_phone = ?, 
          c_intro = ?, 
          c_check_in = ?, 
          c_check_out = ?, 
          c_area_info = ?
        WHERE idx = ?
      `;
  db.connection.query(sql, listData, function (err, results, fields) {
    return res.json(results);
  });
}

function search(req, res, next) {
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

  let { method, query } = req.query;
  query = "%" + query + "%";

  if (method == "name") {
    db.connection.query(
      "SELECT * FROM `camp` WHERE `c_name` LIKE ?",
      query,
      function (err, results, fields) {
        console.log(results);
        return res.json(results);
      }
    );
  } else if (method == "address") {
    db.connection.query(
      "SELECT * FROM `camp` WHERE `c_address` LIKE ?",
      query,
      function (err, results, fields) {
        console.log(results);
        return res.json(results);
      }
    );
  } else if (method == "category") {
    db.connection.query(
      "SELECT * FROM `camp` WHERE `c_category` LIKE ?",
      query,
      function (err, results, fields) {
        console.log(results);
        return res.json(results);
      }
    );
  } else {
    db.connection.query(
      `SELECT * FROM camp WHERE 
          c_category LIKE ? OR 
          c_name LIKE ? OR 
          c_address LIKE ? OR 
          c_phone LIKE ? OR 
          c_intro LIKE ? OR 
          c_check_in LIKE ? OR 
          c_check_out LIKE ? OR 
          c_area_info LIKE ?`,
      [query, query, query, query, query, query, query, query],
      function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database query error" });
        }
        console.log(results);
        return res.json(results);
      }
    );
  }
}

function getCampAll() {
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
  console.log(idx);
  db.connection.query("SELECT * FROM `camp` ", function (err, results, fields) {
    return res.json(results);
  });
}

function getCampId(req, res, next) {
  const campid = req.query.campid;
  // console.log(idx);
  db.connection.query(
    "SELECT * FROM `site` WHERE `shop_id` = ?",
    campid,
    function (err, results, fields) {
      return res.json(results);
    }
  );
}

function getShopToken(req, res, next) {
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

  const data = jwt.decode(token).username;

  // console.log(idx);
  db.connection.query(
    "SELECT * FROM `camp` WHERE `c_shop_id` = ?",
    data,
    function (err, results, fields) {
      return res.json(results);
    }
  );
}

function isOkCamp(req, res, next) {
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

  const myCamp = req.query.campid;

  let myRes = "";

  if (myCamp === jwt.decode(token).username) {
    myRes = { msg: "본인 캠핑장이 맞습니다", status: "OK" };
    res.json(myRes);
  } else {
    myRes = { msg: "본인 캠핑장이 맞습니다", status: "FAIL" };
    res.json(myRes);
  }
}

module.exports = {
  addShopInfo,
  getIdxInfo,
  updateCampInfo,
  search,
  getCampAll,
  getCampId,
  getShopToken,
  isOkCamp,
};
