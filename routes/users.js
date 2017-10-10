var express = require('express');
var router = express.Router();
var jsonResponseConfig = require('../json-response-config.json');

/* GET users listing. */
router.get('*', function(req, res, next) {
    alert("req.path: " + req.path);
    alert("jsonResponseConfig[req.path]: " + jsonResponseConfig[req.path]);
  if (jsonResponseConfig[req.path]) {
    var responseFileContents = require(jsonResponseConfig[req.path]);
    res.send(JSON.stringify(responseFileContents));
  }
});

module.exports = router;
