'use strict';

let files = require ( './util/file-utilities.js' );
let log = require ( './util/logger-utilities.js' );
let DatabaseConnectorManager = require ( './database-connectors/database-connector-manager' );

function Router ( ) { }

Router.indexes = {};
Router.databaseConnectionManager = null;

/**
 * @param router - Express router. This method will add routers to it.
 * @param config - The config file for the server.
 * @param databaseConnectionCallback - Called if database connections are made. The callback
 * will be passed the promises from creating all database connections.
 * @returns Returns the express router.
 */
Router.connect = function ( router, config, databaseConnectionCallback ) {
    if ( (!config) || (!router) ) {
        return router;
    }

    if (config.mocks) {
        for (let loop1 = 0; loop1 < config.mocks.length; loop1++) {
            let mock = config.mocks[loop1];
            let verb = ((mock.verb) ? mock.verb.toUpperCase() : "GET" );
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
                if (log.will(log.ERROR)) {
                    log.error("Handler not defined for mock " + mock.path + ".");
                    continue;
                }
            }
            if ("GET" === verb) {
                router.get(mock.path, handler);
            } else if ("PUT" === verb) {
                router.put(mock.path, handler);
            } else if ("POST" === verb) {
                router.post(mock.path, handler);
            } else if ("PATCH" === verb) {
                router.patch(mock.path, handler);
            } else if ("DELETE" === verb) {
                router.delete(mock.path, handler);
            } else if ("OPTIONS" === verb) {
                router.opt(microservice.path, handler);
            }
        }
    }

    if (config.microservices) {
        for (let loop2 = 0; loop2 < config.microservices.length; loop2++) {
            let microservice = config.microservices[loop2];
            let verb = ((microservice.verb) ? microservice.verb.toUpperCase() : "GET" );
            let microservicePath = microservice.serviceFile;
            let microserviceClass = require( microservicePath );

            let micro = new microserviceClass();
            let handler = (req, res) => {
                Router.addHeaders(microservice, res);

                try {
                    micro.do(req, res, microservice);
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
                    log.error("Handler not defined for microservice " + microservice.path + ".");
                    continue;
                }
            }
            if ("GET" === verb) {
                router.get(microservice.path, handler);
            } else if ("PUT" === verb) {
                router.put(microservice.path, handler);
            } else if ("POST" === verb) {
                router.post(microservice.path, handler);
            } else if ("PATCH" === verb) {
                router.patch(microservice.path, handler);
            } else if ("DELETE" === verb) {
                router.del(microservice.path, handler);
            } else if ("OPTIONS" === verb) {
                router.opt(microservice.path, handler);
            }
        }
    }

    if (config.databaseConnections) {
        Router.databaseConnectionManager = new DatabaseConnectorManager();
        let databaseConnectionPromises = Router.databaseConnectionManager.connect(config);

        for (let loop3 = 0; loop3 < config.databaseConnections.length; loop3++) {
            let databaseConnectionInfo = config.databaseConnections[loop3];

            if (databaseConnectionInfo.generateConnectionAPI) {
                Router.databaseConnectionManager.buildConnectionAPI( Router, router, databaseConnectionInfo );
            }
            if (databaseConnectionInfo.generateTableAPI) {
                Router.databaseConnectionManager.buildTableAPI( Router, router, databaseConnectionInfo );
            }
        }
        if (databaseConnectionCallback) {
            databaseConnectionCallback(databaseConnectionPromises);
        }
    }

    return router;
};

Router.defaultResponse = function ( res ) {
    const error = {
        title: "Not Found",
        message: "File Not Found.",
        error: {
            status: 404
        }
    };
    res.render('error', error);
};

Router.addHeaders = function ( configRecord, res ) {
    if ((!configRecord.headers) || (!configRecord.headers.length)){
        return;
    }
    for (let loop = 0; loop < configRecord.headers.length; loop++) {
        let header = configRecord.headers[loop];
        res.header(header.header, header.value);
    }
};

Router.sendErrorResponse = function ( error, res, status ) {
    res.status(((status)? status : 500));
    res.render("error", error);
};

Router.___buildJSONFileHandlerFromString = function ( mock ) {
    let handler = (req, res) => {
        Router.addHeaders(mock, res);
        if (!files.existsSync(mock.response)) {
            const error = {
                title: mock.response,
                message: "File Not Found.",
                error: {
                    status: 404
                }
            };
            res.render("error", error);
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
            const error = {
                title: mock.response,
                message: "File Not Found.",
                error: {
                    status: 404
                }
            };
            res.render("error", error);
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
            const error = {
                title: mock.response,
                message: "File Not Found.",
                error: {
                    status: 404
                }
            };
            res.render("error", error);
            return;
        }

        let jsonResponseFileContents = files.readFileSync(mock.response[index], mock.encoding);
        let checkForValidJSON = JSON.parse( jsonResponseFileContents );

        res.send(jsonResponseFileContents);
        Router.___incrementIndex( mock, index );
    };
    return handler;
};

Router.___buildHandlebarsFileHandlerFromArrayOfStrings = function ( mock ) {
    let handler = (req, res) => {
        let index = Router.___getIndex( mock );

        Router.addHeaders(mock, res);
        res.render(mock.response[index], mock.hbsData[index]);
        Router.___incrementIndex( mock, index );
    };
    return handler;
};

Router.___buildTextFileHandlerFromArrayOfStrings = function ( mock ) {
    let handler = (req, res) => {
        let index = Router.___getIndex( mock );

        Router.addHeaders(mock, res);
        if (!files.existsSync(mock.response[index])) {
            const error = {
                title: mock.response,
                message: "File Not Found.",
                error: {
                    status: 404
                }
            };
            res.render("error", error);
            return;
        }

        let textResponseFileContents = files.readFileSync(mock.response[index], mock.encoding);

        res.send(textResponseFileContents);
        Router.___incrementIndex( mock, index );
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
        Router.___incrementIndex( mock, index );
    };
    return handler;
};

Router.___buildTextFileHandlerFromArrayOfObjects = function ( mock ) {
    let handler = (req, res) => {
        let index = Router.___getIndex( mock );

        Router.addHeaders(mock, res);

        let textResponse = ((mock.response[index].text)? mock.response[index].text : JSON.stringify(mock.response[index]) );

        res.send(textResponse);
        Router.___incrementIndex( mock, index );
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
};

Router.___incrementIndex = function (mock, index ) {
    index++;
    if ( mock.response.length <= index ) {
        index = 0;
    }
    Router.indexes[mock.path].___index = index;
};

module.exports = Router;
