const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 아이디 중복 검사
function useid(req, res, next) {
  const r = req.body;
  const arr = [r.userid];

  db.connection.query(
    "SELECT * FROM `member` WHERE `userid` = ?",
    arr[0],
    function (err, results, fields) {
      if (results[0] === undefined) {
        const result = {
          status: "empty",
          msg: "사용가능한 아이디 입니다.",
        };
        res.json(result);
        return;
      } else {
        const result = {
          status: "not empty",
          msg: "이미 존재하는 아이디 입니다.",
        };
        res.json(result);
        return;
      }
    }
  );
}

// 회원가입
function register(req, res, next) {
  const r = req.body;
  const encryptedPW = bcrypt.hashSync(r.userpw, 10);
  const arr = [r.nickname, r.userid, encryptedPW, r.role];

  // 유저가 존재하는지 확인
  db.connection.query(
    "SELECT * FROM `member` WHERE `userid` = ?",
    arr[1],
    function (err, results, fields) {
      if (results[0] !== undefined) {
        let result01 = {
          status: "not empty",
          msg: "이미 존재하는 아이디 입니다.",
        };
        res.json(result01);
        return;
      } else {
        //회원생성
        const sql =
          "INSERT INTO `member`(`nickname`, `userid`, `userpw`, `role`) VALUES (?,?,?,?)";

        db.connection.query(sql, arr, (err, result, fields) => {
          let result02 = {
            status: "success",
            msg: "회원가입이 완료 되었습니다.",
          };
          res.json(result02);
          return;
        });
      }
    }
  );
}

// 로그인
function login(req, res, next) {
  const r = req.body;
  const arr = [r.userid, r.userpw];

  db.connection.query(
    "SELECT * FROM `member` WHERE `userid` = ?",
    arr[0],
    function (err, results, fields) {
      if (results[0] === undefined) {
        const result = {
          status: "no user",
          msg: "존재하지 않는 사용자 입니다.",
        };
        res.json(result);
        return;
      } else {
        // 회원이 존재하고 비밀번호가 일치하는지 확인
        const same = bcrypt.compareSync(arr[1], results[0].userpw);

        if (arr[0] === results[0].userid && same === true) {
          // 사용자 신원 확인 후
          const payload = {
            idx: results[0].idx,
            username: arr[0],
            nickname: results[0].nickname,
            role: results[0].role,
          };
          const token = jwt.sign(payload, process.env.ENV_SKEY);
          const result = {
            status: "success",
            msg: "로그인 성공!",
            token: token,
            data: jwt.decode(token),
          };
          res.json(result);
          return;
        } else {
          const result = {
            status: "fail",
            msg: "로그인 실패",
          };
          res.json(result);
          return;
        }
      }
    }
  );
}

module.exports = { useid, register, login };
