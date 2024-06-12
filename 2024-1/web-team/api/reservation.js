const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function isResOk(req, res, next) {
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

  const { date, enddate, camp_idx, site } = req.body;

  db.connection.query(
    "SELECT * FROM `reservation` WHERE r_date = ? OR r_end_date = ? OR r_site=?",
    [date, enddate, site],
    function (err, results, fields) {
      if (results[0] != undefined) {
        return res.json({ msg: "예약대기" });
      } else {
        return res.json({ msg: "예약가능" });
      }
    }
  );
}

function resSubmit(req, res, next) {
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

  const { date, enddate, camp_idx, userid, site } = req.body;
  db.connection.query(
    "SELECT * FROM `reservation` WHERE r_date = ? OR r_end_date = ? OR r_site=?",
    [date, enddate, site],
    function (err, results, fields) {
      if (results[0] != undefined) {
        console.log(results);
        return res.json({ msg: "예약불가" });
      } else {
        const sql =
          "INSERT INTO `reservation`(`r_date`, `r_end_date` ,`camp_idx`, `r_site`, `r_userid`, `r_status`) VALUES (?,?,?,?,?,?)";

        db.connection.query(
          sql,
          [date, enddate, camp_idx, site, userid, "예약대기"],
          (err, result, fields) => {
            let result02 = {
              status: "success",
              msg: "예약이 완료되었습니다.",
            };
            res.json(result02);
            return;
          }
        );
      }
    }
  );
}

function resAdminChange(req, res, next) {
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

  const { idx, status } = req.body;

  const listData = [status, idx];

  const sql = `
            UPDATE \`reservation\`
            SET
              r_status = ?
            WHERE idx = ?
          `;
  db.connection.query(sql, listData, function (err, results, fields) {
    return res.json(results);
  });
}

function showMypage(req, res, next) {
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

  const { myid } = req.body;
  db.connection.query(
    "SELECT * FROM `reservation` WHERE `r_userid`=?",
    myid,
    function (err, results, fields) {
      return res.json(results);
    }
  );
}

function showList(req, res, next) {
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

  const { idx } = req.query;
  db.connection.query(
    "SELECT * FROM `reservation` WHERE `camp_idx`=?",
    idx,
    function (err, results, fields) {
      return res.json(results);
    }
  );
}

module.exports = { isResOk, resSubmit, resAdminChange, showMypage, showList };
