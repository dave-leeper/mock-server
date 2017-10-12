var express = require('express');
var router = express.Router();
var responseConfig = require('../response-config.json');

router.get('*', function(req, res, next) {
    addHeaders(req.path, res);

    var responseFileInfo = getResponseFileInfo(req.path);
    if (!responseFileInfo) {
        defaultResponse(res);
        return;
    }

    var jsonResponseFileContents = require(responseFileInfo.responseFile);
    if ("JSON" === responseFileInfo.fileType.toString().toUpperCase()) {
        res.send(JSON.stringify(jsonResponseFileContents));
    } else {
        res.send(jsonResponseFileContents);
    }
});

function defaultResponse (res) {
    res.render('index', {title: 'Express'});
}

function addHeaders(path, res) {
    for (var loop = 0; loop < responseConfig.length; loop++) {
        var responseHeaders = responseConfig[loop];

        if ((responseHeaders.path != path)
        || (typeof responseHeaders.headers === 'undefined')
        || (!responseHeaders.headers.length)){
            continue;
        }
        for (var loop2 = 0; loop2 < responseHeaders.headers.length; loop2++) {
            var header = responseHeaders.headers[loop2];
            res.header(header.header, header.value);
        }
    }
}

function getResponseFileInfo(path) {
    for (var loop = 0; loop < responseConfig.length; loop++) {
        var responseRecord = responseConfig[loop];
        if ((responseRecord.path == path)
        && (responseRecord.responseFile)) {
            return responseRecord;
        }
    }
    return null;
}

module.exports = router;
