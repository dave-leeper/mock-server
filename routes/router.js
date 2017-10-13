'use strict'

var express = require('express');
var router = express.Router();
var util = require ( '../util/utilities.js' );
var log = require ( '../util/logger-utilities.js' );

function Router ( ) { }

Router.startTime = null;

Router.serverConfig = null;

Router.init = function ( ) {
    router.get('*', function(req, res) {
        if ( log.will( log.ALL )) log.all( "Router.init: Rounting " + req.path );
        var mockResponseInfo = Router.getMockResponseInfo(req.path);

        if (mockResponseInfo) {
            Router.addHeaders(mockResponseInfo, res);
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

        var servicesInfo = Router.getServiceInfo(req.path);

        if (servicesInfo) {
            var servicePath = "../services/" + servicesInfo.serviceFile;
            var serviceClass = require(servicePath);
            var service = new serviceClass();

            service.do(req, res, Router, servicesInfo);
            return;
        }

        Router.defaultResponse(res);
    });
    return router;
};

Router.defaultResponse = function ( res ) {
    res.render('not-found', {title: 'File Not Found'});
};

Router.addHeaders = function ( responseRecord, res ) {
    if ((typeof responseRecord.headers === 'undefined')
    || (!responseRecord.headers.length)){
        return;
    }
    for (var loop = 0; loop < responseRecord.headers.length; loop++) {
        var header = responseRecord.headers[loop];
        res.header(header.header, header.value);
    }
};

Router.getMockResponseInfo = function ( path ) {
    if (!Router.serverConfig) {
        return null;
    }
    for (var loop = 0; loop < Router.serverConfig.mocks.length; loop++) {
        var responseRecord = Router.serverConfig.mocks[loop];

        if ((responseRecord.path == path)
        && (responseRecord.responseFile)) {
            return responseRecord;
        }
    }
    return null;
};

Router.getServiceInfo = function ( path ) {
    if (!Router.serverConfig) {
        return null;
    }
    for (var loop = 0; loop < Router.serverConfig.services.length; loop++) {
        var responseRecord = Router.serverConfig.services[loop];

        if ((responseRecord.path == path)
        && (responseRecord.serviceFile)) {
            return responseRecord;
        }
    }
    return null;
}

module.exports = Router;
