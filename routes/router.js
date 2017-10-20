'use strict'

let util = require ( '../util/utilities.js' );
let log = require ( '../util/logger-utilities.js' );
let fs = require("fs");

function Router ( ) { }

Router.startTime = null;
Router.server = null;

Router.connect = function (router ) {
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
    for (let loop = 0; loop < responseRecord.headers.length; loop++) {
        let header = responseRecord.headers[loop];
        res.header(header.header, header.value);
    }
};

Router.getMockResponseInfo = function ( path ) {
    if ((!Router.server) || (!Router.server.serverConfig)) {
        return null;
    }
    for (let loop = 0; loop < Router.server.serverConfig.mocks.length; loop++) {
        let responseRecord = Router.server.serverConfig.mocks[loop];

        if ((responseRecord.path == path)
        && (responseRecord.responseFile)) {
            return responseRecord;
        }
    }
    return null;
};

Router.getMicroserviceInfo = function (path ) {
    if ((!Router.server) || (!Router.server.serverConfig)) {
        return null;
    }
    for (let loop = 0; loop < Router.server.serverConfig.services.length; loop++) {
        let responseRecord = Router.server.serverConfig.services[loop];

        if ((responseRecord.path == path)
            && (responseRecord.serviceFile)) {
            return responseRecord;
        }
    }
    return null;
}

Router.route = function ( req, res ) {
    if ( log.will( log.ALL )) log.all( "Router.router: Routing " + req.path );
    let mockResponseInfo = Router.getMockResponseInfo(req.path);

    if (mockResponseInfo) {
        Router.addHeaders(mockResponseInfo, res);
        if ("JSON" == mockResponseInfo.fileType.toString().toUpperCase()) {
            if (!fs.existsSync(mockResponseInfo.responseFile)) {
                res.render("not-found", null);
                return;
            };
            let jsonResponseFileContents = util.readFileSync(mockResponseInfo.responseFile);

            res.send(jsonResponseFileContents);
        } else if ("HBS" == mockResponseInfo.fileType.toString().toUpperCase()) {
            res.render(mockResponseInfo.responseFile, mockResponseInfo.hbsData);
        } else {
            if (!fs.existsSync(mockResponseInfo.responseFile)) {
                res.render("not-found", null);
                return;
            };
            let textResponseFileContents = util.readFileSync(mockResponseInfo.responseFile, mockResponseInfo.encoding);

            res.send(textResponseFileContents);
        }
        return;
    }

    let microserviceInfo = Router.getMicroserviceInfo(req.path);

    if (microserviceInfo) {
        let microservicePath = "../microservices/" + microserviceInfo.serviceFile;
        let microserviceClass = require(microservicePath);
        let microservice = new microserviceClass();

        Router.addHeaders(microserviceInfo, res);
        try {
            microservice.do(req, res, Router, microserviceInfo);
        } catch (err) {
            res.render("error", { message: "Error calling microservice " + microserviceInfo.name + ".", error: { status: 500, stack: err.stack} });
        }
        return;
    }

    Router.defaultResponse(res);
}

module.exports = Router;
