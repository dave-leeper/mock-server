'use strict'

var util = require ( '../util/utilities.js' );
var log = require ( '../util/logger-utilities.js' );
var fs = require("fs");

function Router ( ) { }

Router.startTime = null;

Router.serverConfig = null;

Router.init = function ( router ) {
    router.get('*', Router.route);
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

Router.route = function ( req, res ) {
    if ( log.will( log.ALL )) log.all( "Router.router: Rounting " + req.path );
    var mockResponseInfo = Router.getMockResponseInfo(req.path);

    if (mockResponseInfo) {
        Router.addHeaders(mockResponseInfo, res);
        if ("JSON" == mockResponseInfo.fileType.toString().toUpperCase()) {
            if (!fs.existsSync(mockResponseInfo.responseFile)) {
                res.render("not-found", null);
                return;
            };
            var jsonResponseFileContents = util.readFileSync(mockResponseInfo.responseFile);

            res.send(jsonResponseFileContents);
        } else if ("HBS" == mockResponseInfo.fileType.toString().toUpperCase()) {
            res.render(mockResponseInfo.responseFile, mockResponseInfo.hbsData);
        } else {
            if (!fs.existsSync(mockResponseInfo.responseFile)) {
                res.render("not-found", null);
                return;
            };
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

        Router.addHeaders(servicesInfo, res);
        service.do(req, res, Router, servicesInfo);
        return;
    }

    Router.defaultResponse(res);
}

module.exports = Router;
