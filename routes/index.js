var express = require('express');
var router = express.Router();
var jsonResponseConfig = require('../json-response-config.json');
var headerResponseConfig = require('../header-response-config.json');

/* GET home page. */
router.get('*', function(req, res, next) {
    console.log("headerResponseConfig: " + JSON.stringify(headerResponseConfig));
    addHeaders(req.path, res);
    if (getResponseFile(req.path)) {
        var responseFileContents = require(getResponseFile(req.path));
        res.send(JSON.stringify(responseFileContents));
    }
    else {
        res.render('index', {title: 'Express'});
    }
});

function getResponseFile(path) {
    for (var loop = 0; loop < jsonResponseConfig.length; loop++) {
        var responseRecord = jsonResponseConfig[loop];
        console.log("JSON.stringify(responseRecord): " + JSON.stringify(responseRecord));
        if (responseRecord.path == path) {
            return responseRecord.responseFile;
        }
    }
    return null;
}

function addHeaders(path, res) {
    for (var loop = 0; loop < headerResponseConfig.length; loop++) {
        var responseHeaders = headerResponseConfig[loop];
        console.log("JSON.stringify(responseHeaders): " + JSON.stringify(responseHeaders));
        if (responseHeaders.path != path) {
            continue;
        }
        for (var loop2 = 0; loop2 < responseHeaders.headers.length; loop2++) {
            var header = responseHeaders.headers[loop2];
            res.header(header.header, header.value);
        }
    }
}
module.exports = router;
