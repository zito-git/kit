var express = require("express");
var router = express.Router();
router.get("/", function (req, res, next) {
  const response = {
    status: "err",
    msg: "index page",
  };
  res.json(response);
});

module.exports = router;
