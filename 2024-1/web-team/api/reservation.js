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

  let { date, enddate, camp_idx, site } = req.body;
  let badList = [];
  let badList1 = [];
  date = new Date(date);
  enddate = new Date(enddate);
  db.connection.query(
    `
  SELECT *
FROM reservation
WHERE r_site =? AND camp_idx =?
    `,
    [site, camp_idx],
    function (err, results, fields) {
      for (let i = 0; i < results.length; i++) {
        const dbDate = new Date(results[i].r_date);
        const dbEnd = new Date(results[i].r_end_date);

        // DB날짜채우기
        const diff = diffDates(results[i].r_date, results[i].r_end_date);

        temp = 0;
        for (let j = 0; j < diff; j++) {
          const newDate = addDays(results[i].r_date, j);
          badList.push(newDate.toDateString());
        }

        //디비
        console.log("db");
        console.log(badList);

        // 유저 날짜채우기

        const diff1 = diffDates(date, enddate);

        badList1 = [];

        for (let j = 0; j < diff; j++) {
          const newDate = addDays(date, j);
          badList1.push(newDate.toDateString());
        }
        console.log("유저");
        console.log(badList1);
      }

      const matchingStrings = findMatchingStrings(badList, badList1);
      if (matchingStrings[0] != undefined) {
        const msg = { msg: "예약 대기중 입니다." };
        res.json(msg);
      } else {
        const msg = { msg: "예약 가능 합니다" };
        res.json(msg);
        return;
      }
    }
  );
}

function findMatchingStrings(array1, array2) {
  return array1.filter((str) => array2.includes(str));
}

function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date;
}

function dateToNumber(dateString) {
  const date = new Date(dateString);
  return date.getTime(); // 밀리초 단위로 변환된 숫자 반환
}

// 두 날짜의 차이를 구하고, 그 값을 날짜로 변환하는 함수
function diffDates(dateString1, dateString2) {
  const diffInMilliseconds = Math.abs(
    dateToNumber(dateString1) - dateToNumber(dateString2)
  ); // 차이를 밀리초로 구함
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24); // 밀리초를 날짜로 변환
  return diffInDays;
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
