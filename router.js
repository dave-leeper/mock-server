'use strict'

let util = require ( './util/utilities.js' );
let log = require ( './util/logger-utilities.js' );
let fs = require("fs");

function Router ( ) { }

Router.startTime = null;
Router.server = null;

Router.connect = function ( router, config ) {
    if ( (!config) || (!router) ) {
        return router;
    }

    let mocks = config.mocks;
    let microservices = config.microservices;
    let databaseConnections = config.databaseConnections;

    if (mocks) {
        for (let loop1 = 0; loop1 < mocks.length; loop1++) {
            let mock = mocks[loop1];
            let verb = ((mock.verb) ? mock.verb : "GET" );
            let responseType = ((mock.responseType)? mock.responseType.toString().toUpperCase() : "" );
            let handler;

            if ("JSON" == responseType) {
                if (typeof mock.response === 'string') {
                    handler = this.___buildJSONFileHandlerFromString( mock );
                } else if ( Object.prototype.toString.call( mock.response ) === '[object Array]' ){
                    handler = this.___buildJSONFileHandlerFromArray( mock );
                }
            } else if ("HBS" == responseType) {
                if (typeof mock.response === 'string') {
                    handler = this.___buildHandlebarsFileHandlerFromString( mock );
                } else if ( Object.prototype.toString.call( mock.response ) === '[object Array]' ){
                    handler = this.___buildHandlebarsFileHandlerFromArray( mock );
                }
            } else {
                if (typeof mock.response === 'string') {
                    handler = this.___buildTextFileHandlerFromString( mock );
                } else if ( Object.prototype.toString.call( mock.response ) === '[object Array]' ){
                    handler = this.___buildTextFileHandlerFromArray( mock );
                }
            }

            if ("GET" === verb) {
                router.get(mock.path, handler);
            } else if ("PUT" === verb) {
                router.put(mock.path, handler);
            } else if ("POST" === verb) {
                router.post(mock.path, handler);
            } else if ("DELETE" === verb) {
                router.delete(mock.path, handler);
            } else if ("OPTIONS" === verb) {
                router.opt(microservice.path, handler);
            }
        }
    }

    if (microservices) {
        for (let loop2 = 0; loop2 < microservices.length; loop2++) {
            let microservice = microservices[loop2];
            let verb = ((microservice.verb) ? microservice.verb : "GET" );
            let microservicePath = microservice.serviceFile;
            let microserviceClass = require( microservicePath );

            let micro = new microserviceClass();
            let handler = (req, res) => {
                Router.addHeaders(microservice, res);

                try {
                    micro.do(req, res, Router, microservice);
                } catch (err) {
                    res.status(500);
                    res.render("error", {
                        message: "Error calling microservice " + microservice.name + ".",
                        error: {status: 500, stack: err.stack}
                    });
                }
                return;
            }

            if ("GET" === verb) {
                router.get(microservice.path, handler);
            } else if ("PUT" === verb) {
                router.put(microservice.path, handler);
            } else if ("POST" === verb) {
                router.post(microservice.path, handler);
            } else if ("DELETE" === verb) {
                router.delete(microservice.path, handler);
            } else if ("OPTIONS" === verb) {
                router.opt(microservice.path, handler);
            }
        }
    }

    if (databaseConnections) {
    }

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
    if ((!Router.server) || (!Router.server.serverConfig) || (!Router.server.serverConfig.mocks)) {
        return null;
    }
    for (let loop = 0; loop < Router.server.serverConfig.mocks.length; loop++) {
        let responseRecord = Router.server.serverConfig.mocks[loop];

        if ((responseRecord.path == path)
        && (responseRecord.response)) {
            return responseRecord;
        }
    }
    return null;
};

Router.getMicroserviceInfo = function ( path ) {
    if ((!Router.server) || (!Router.server.serverConfig)) {
        return null;
    }
    for (let loop = 0; loop < Router.server.serverConfig.microservices.length; loop++) {
        let responseRecord = Router.server.serverConfig.microservices[loop];

        if ((responseRecord.path == path)
            && (responseRecord.serviceFile)) {
            return responseRecord;
        }
    }
    return null;
};

Router.___buildJSONFileHandlerFromString = function ( mock ) {
    let handler = (req, res) => {
        Router.addHeaders(mock, res);
        if (!fs.existsSync(mock.response)) {
            res.render("not-found", null);
            return;
        }

        let jsonResponseFileContents = util.readFileSync(mock.response);
        let checkForValidJSON = JSON.parse( jsonResponseFileContents );

        res.send(jsonResponseFileContents);
    };
    return handler;
};

Router.___buildHandlebarsFileHandlerFromString = function ( mock ) {
    let handler = (req, res) => {
        Router.addHeaders(mock, res);
        res.render(mock.response, mock.hbsData);
    };
    return handler;
};

Router.___buildTextFileHandlerFromString = function ( mock ) {
    let handler = (req, res) => {
        Router.addHeaders(mock, res);
        if (!fs.existsSync(mock.response)) {
            res.render("not-found", null);
            return;
        }

        let textResponseFileContents = util.readFileSync(mock.response, mock.encoding);

        res.send(textResponseFileContents);
    };
    return handler;
};

Router.___buildJSONFileHandlerFromArray = function ( mock ) {
    let handler = (req, res) => {
        let index = ((mock.___index)?  mock.___index : 0 );

        Router.addHeaders(mock, res);
        if (!fs.existsSync(mock.response[index])) {
            res.render("not-found", null);
            return;
        }

        let jsonResponseFileContents = util.readFileSync(mock.response[index]);
        let checkForValidJSON = JSON.parse( jsonResponseFileContents );

        res.send(jsonResponseFileContents);
        mock.___index = index + 1;
        if ( mock.response.length <= mock.___index ) {
            mock.___index = 0;
        }
    };
    return handler;
};

Router.___buildHandlebarsFileHandlerFromArray = function ( mock ) {
    let handler = (req, res) => {
        let index = ((mock.___index)?  mock.___index : 0 );

        Router.addHeaders(mock, res);
        res.render(mock.response[index], mock.hbsData[index]);
        mock.___index = index + 1;
        if ( mock.response.length <= mock.___index ) {
            mock.___index = 0;
        }
    };
    return handler;
};

Router.___buildTextFileHandlerFromArray = function ( mock ) {
    let handler = (req, res) => {
        let index = ((mock.___index)?  mock.___index : 0 );

        Router.addHeaders(mock, res);
        if (!fs.existsSync(mock.response[index])) {
            res.render("not-found", null);
            return;
        }

        let textResponseFileContents = util.readFileSync(mock.response[index], mock.encoding);

        res.send(textResponseFileContents);
        mock.___index = index + 1;
        if ( mock.response.length <= mock.___index ) {
            mock.___index = 0;
        }
    };
    return handler;
};

module.exports = Router;
