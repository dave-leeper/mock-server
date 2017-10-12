var express = require('express');
var router = express.Router();
var serverConfig = require('../server-config.json');

router.get('*', function(req, res, next) {
    addHeaders(req.path, res);

    var responseFileInfo = getResponseFileInfo(req.path);
    if (!responseFileInfo) {
        defaultResponse(res);
        return;
    }

    console.log("responseFileInfo.fileType.toString().toUpperCase(): " + responseFileInfo.fileType.toString().toUpperCase());
    if ("JSON" == responseFileInfo.fileType.toString().toUpperCase()) {
        var jsonResponseFileContents = require(responseFileInfo.responseFile);

        res.send(JSON.stringify(jsonResponseFileContents));
    } else if ("HBS" == responseFileInfo.fileType.toString().toUpperCase()) {
        console.log("responseFileInfo.responseFile: " + responseFileInfo.responseFile);
        console.log("responseFileInfo.hbsData: " + JSON.stringify(responseFileInfo.hbsData));
        res.render(responseFileInfo.responseFile, responseFileInfo.hbsData);
    } else {
        var textResponseFileContents = readFileSync(responseFileInfo.responseFile, responseFileInfo.encoding);

        res.send(textResponseFileContents);
    }
});

function defaultResponse (res) {
    res.render('not-found', {title: 'File Not Found'});
}

function addHeaders(path, res) {
    for (var loop = 0; loop < serverConfig.mock.length; loop++) {
        var responseRecord = serverConfig.mock[loop];

        if ((responseRecord.path != path)
        || (typeof responseRecord.headers === 'undefined')
        || (!responseRecord.headers.length)){
            continue;
        }
        for (var loop2 = 0; loop2 < responseRecord.headers.length; loop2++) {
            var header = responseRecord.headers[loop2];
            res.header(header.header, header.value);
        }
    }
}

function getResponseFileInfo(path) {
    for (var loop = 0; loop < serverConfig.mock.length; loop++) {
        var responseRecord = serverConfig.mock[loop];

        if ((responseRecord.path == path)
        && (responseRecord.responseFile)) {
            return responseRecord;
        }
    }
    return null;
}

function readFileSync(filepath, encoding){
    var fs = require("fs");

    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    return fs.readFileSync(filepath, encoding);
}

module.exports = router;
