'use strict'

var express = require('express');
var router = express.Router();
var serverConfig = require('../server-config.json');
var util = require('../util/utilities.js');

router.get('*', function(req, res, next) {
    var mockResponseInfo = getMockResponseInfo(req.path);

    if (mockResponseInfo) {
        addHeaders(mockResponseInfo, res);
        if ("JSON" == mockResponseInfo.fileType.toString().toUpperCase()) {
            var jsonResponseFileContents = require(mockResponseInfo.responseFile);

            res.send(JSON.stringify(jsonResponseFileContents));
        } else if ("HBS" == mockResponseInfo.fileType.toString().toUpperCase()) {
            res.render(mockResponseInfo.responseFile, mockResponseInfo.hbsData);
        } else {
            var textResponseFileContents = util.readFileSync(mockResponseInfo.responseFile, mockResponseInfo.encoding);

            res.send(textResponseFileContents);
        }
        return;
    }

    var servicesInfo = getServiceInfo(req.path);

    if (servicesInfo) {
        var servicePath = "../services/" + servicesInfo.serviceFile;
        var serviceClass = require(servicePath);
        var service = new serviceClass();

        service.respond(req, res, serverConfig, servicesInfo);
        return;
    }

    defaultResponse(res);
});

function defaultResponse (res) {
    res.render('not-found', {title: 'File Not Found'});
}

function addHeaders(responseRecord, res) {
    if ((typeof responseRecord.headers === 'undefined')
    || (!responseRecord.headers.length)){
        return;
    }
    for (var loop = 0; loop < responseRecord.headers.length; loop++) {
        var header = responseRecord.headers[loop];
        res.header(header.header, header.value);
    }
}

function getMockResponseInfo(path) {
    for (var loop = 0; loop < serverConfig.mocks.length; loop++) {
        var responseRecord = serverConfig.mocks[loop];

        if ((responseRecord.path == path)
        && (responseRecord.responseFile)) {
            return responseRecord;
        }
    }
    return null;
}

function getServiceInfo(path) {
    console.log("getServiceInfo");
    for (var loop = 0; loop < serverConfig.services.length; loop++) {
        var responseRecord = serverConfig.services[loop];

        if ((responseRecord.path == path)
        && (responseRecord.serviceFile)) {
            return responseRecord;
        }
    }
    return null;
}

module.exports = router;
