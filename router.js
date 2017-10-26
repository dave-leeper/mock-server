'use strict'

let files = require ( './util/file-utilities.js' );
let log = require ( './util/logger-utilities.js' );
const indexWorkingFile = "./temp/workingindex.json";

function Router ( ) { }

Router.startTime = null;
Router.server = null;
Router.indexes = {};

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

            if ("JSON" === responseType) {
                if (typeof mock.response === 'string') {
                    handler = this.___buildJSONFileHandlerFromString( mock );
                } else if ( '[object Array]' === Object.prototype.toString.call( mock.response )  ) {
                    if ('string' === typeof mock.response[0] ) {
                        handler = this.___buildJSONFileHandlerFromArrayOfStrings(mock);
                    } else if ( 'object' === typeof mock.response[0] ) {
                        handler = this.___buildJSONFileHandlerFromArrayOfObjects(mock);
                    }
                } else if (( mock.response ) && ( 'object' === typeof mock.response )) {
                    handler = this.___buildJSONFileHandlerFromObject( mock );
                }
            } else if ("HBS" === responseType) {
                if (typeof mock.response === 'string') {
                    handler = this.___buildHandlebarsFileHandlerFromString( mock );
                } else if ( '[object Array]' === Object.prototype.toString.call( mock.response )) {
                    handler = this.___buildHandlebarsFileHandlerFromArrayOfStrings( mock );
                }
            } else {
                if ( 'string' === typeof mock.response ) {
                    handler = this.___buildTextFileHandlerFromString( mock );
                } else if ( '[object Array]' === Object.prototype.toString.call( mock.response )) {
                    if ( 'string' === typeof mock.response[0] ) {
                        handler = this.___buildTextFileHandlerFromArrayOfStrings(mock);
                    } else if ( 'object' === typeof mock.response[0] ) {
                        handler = this.___buildTextFileHandlerFromArrayOfObjects(mock);
                    }
                } else if (( mock.response ) && ( 'object' === typeof mock.response )) {
                    handler = this.___buildTextFileHandlerFromObject( mock );
                }
            }
            if (!handler) {
                // if (log.will(log.ERROR)) {
                    console.log("handler not defined for mock " + mock.path);
                    continue;
                // }
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
            };

            if (!handler) {
                if (log.will(log.ERROR)) {
                    log.error("handler not defined for microservice " + microservice.path);
                    continue;
                }
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
        if (!files.existsSync(mock.response)) {
            res.render("not-found", null);
            return;
        }

        let jsonResponseFileContents = files.readFileSync(mock.response);
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
        if (!files.existsSync(mock.response)) {
            res.render("not-found", null);
            return;
        }

        let textResponseFileContents = files.readFileSync(mock.response, mock.encoding);

        res.send(textResponseFileContents);
    };
    return handler;
};

Router.___buildJSONFileHandlerFromArrayOfStrings = function (mock ) {
    let handler = (req, res) => {
        let index = Router.___getIndex( mock );

        Router.addHeaders(mock, res);
        if (!files.existsSync(mock.response[index])) {
            res.render("not-found", null);
            return;
        }

        let jsonResponseFileContents = files.readFileSync(mock.response[index], mock.encoding);
        let checkForValidJSON = JSON.parse( jsonResponseFileContents );

        res.send(jsonResponseFileContents);
        Router.___incrimentIndex( mock, index );
    };
    return handler;
};

Router.___buildHandlebarsFileHandlerFromArrayOfStrings = function ( mock ) {
    let handler = (req, res) => {
        let index = Router.___getIndex( mock );

        Router.addHeaders(mock, res);
        res.render(mock.response[index], mock.hbsData[index]);
        Router.___incrimentIndex( mock, index );
    };
    return handler;
};

Router.___buildTextFileHandlerFromArrayOfStrings = function ( mock ) {
    let handler = (req, res) => {
        let index = Router.___getIndex( mock );

        Router.addHeaders(mock, res);
        if (!files.existsSync(mock.response[index])) {
            res.render("not-found", null);
            return;
        }

        let textResponseFileContents = files.readFileSync(mock.response[index], mock.encoding);

        res.send(textResponseFileContents);
        Router.___incrimentIndex( mock, index );
    };
    return handler;
};

Router.___buildJSONFileHandlerFromObject = function ( mock ) {
    let handler = (req, res) => {
        Router.addHeaders(mock, res);

        let jsonResponse = JSON.stringify(mock.response);
        let checkForValidJSON = JSON.parse( jsonResponse );

        res.send(jsonResponse);
    };
    return handler;
};

Router.___buildTextFileHandlerFromObject = function ( mock ) {
    let handler = (req, res) => {
        Router.addHeaders(mock, res);

        let textResponse = ((mock.response.text)? mock.response.text : JSON.stringify(mock.response) );

        res.send(textResponse);
    };
    return handler;
};

Router.___buildJSONFileHandlerFromArrayOfObjects = function ( mock ) {
    let handler = (req, res) => {
        let index = Router.___getIndex( mock );

        Router.addHeaders(mock, res);

        let jsonResponse = JSON.stringify(mock.response[index]);
        let checkForValidJSON = JSON.parse( jsonResponse );

        res.send(jsonResponse);
        Router.___incrimentIndex( mock, index );
    };
    return handler;
};

Router.___buildTextFileHandlerFromArrayOfObjects = function ( mock ) {
    let handler = (req, res) => {
        let index = Router.___getIndex( mock );

        Router.addHeaders(mock, res);

        let textResponse = ((mock.response[index].text)? mock.response[index].text : JSON.stringify(mock.response[index]) );

        res.send(textResponse);
        Router.___incrimentIndex( mock, index );
    };
    return handler;
};

Router.___getIndex = function ( mock ) {
    if (!Router.indexes[mock.path]) {
        Router.indexes[mock.path] = {};
    }
    if (!Router.indexes[mock.path].___index) {
        Router.indexes[mock.path].___index = 0;
    }

    return Router.indexes[mock.path].___index;
}

Router.___incrimentIndex = function ( mock, index ) {
    index++;
    if ( mock.response.length <= index ) {
        index = 0;
    }
    Router.indexes[mock.path].___index = index;
}

module.exports = Router;
