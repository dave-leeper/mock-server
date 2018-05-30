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
            } else if ("BLOB" === responseType) {
                if (typeof mock.response === 'string') {
                    handler = this.___buildBLOBFileHandlerFromString( mock );
                } else if ( '[object Array]' === Object.prototype.toString.call( mock.response )) {
                    handler = this.___buildBLOBFileHandlerFromArrayOfStrings( mock );
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
            let microservicePath = "./microservices/" + microservice.serviceFile;
            let microserviceClass = require( microservicePath );

            let micro = new microserviceClass();
            let handler = (req, res, next) => {
                Router.addHeaders(microservice, res);
                Router.addCookies(microservice, res);

                try {
                    micro.do(req, res, next, microservice);
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
            if (databaseConnectionInfo.generateIndexAPI) {
                Router.databaseConnectionManager.buildIndexAPI( Router, router, databaseConnectionInfo );
            }
            if (databaseConnectionInfo.generateDataAPI) {
                Router.databaseConnectionManager.buildDataAPI( Router, router, databaseConnectionInfo );
            }
        }
        if (databaseConnectionCallback) {
            databaseConnectionCallback(databaseConnectionPromises);
        }
    }

    return router;
};

Router.defaultResponse = function ( req, res ) {
    let originalURL = ((req && req.originalUrl)? req.originalUrl : undefined);
    const error = {
        title: "Not Found",
        message: "File Not Found.",
        error: {
            status: 404
        },
        requestURL: originalURL
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

Router.addCookies = function ( configRecord, res ) {
    if ((!configRecord.cookies) || (!configRecord.cookies.length)){
        return;
    }
    for (let loop = 0; loop < configRecord.cookies.length; loop++) {
        let cookie = { name: configRecord.cookies[loop].name, value: configRecord.cookies[loop].value };
        let age = null;
        if (configRecord.cookies[loop].expires) {
            let offset = parseInt( configRecord.cookies[loop].expires );
            let expireTime = new Date(Number(new Date()) + offset); ;
            age = { expires: expireTime };
        } else if (configRecord.cookies[loop].maxAge) {
            age = { maxAge: parseInt( configRecord.cookies[loop].maxAge )};
        }
        if (!age) res.cookie( cookie.name, cookie.value);
        else res.cookie( cookie.name, cookie.value, age);
    }
};

Router.sendErrorResponse = function ( error, res, status ) {
    res.status(((status)? status : 500));
    res.render("error", error);
};

Router.___buildJSONFileHandlerFromString = function ( mock ) {
    let handler = (req, res) => {
        Router.addHeaders(mock, res);
        Router.addCookies(mock, res);
        let responseFile = Router.___replaceResponseParams(mock.response, req );
        if (!files.existsSync(responseFile)) {
            const error = {
                title: responseFile,
                message: "File Not Found: " + responseFile + ".",
                error: {
                    status: 404
                }
            };
            res.render("error", error);
            return;
        }

        let jsonResponseFileContents = files.readFileSync(responseFile);
        let checkForValidJSON = JSON.parse( jsonResponseFileContents );

        res.send(jsonResponseFileContents);
    };
    return handler;
};

Router.___buildHandlebarsFileHandlerFromString = function ( mock ) {
    let handler = (req, res) => {
        Router.addHeaders(mock, res);
        Router.addCookies(mock, res);
        let responseFile = Router.___replaceResponseParams(mock.response, req );
        res.render(responseFile, mock.hbsData);
    };
    return handler;
};

Router.___buildTextFileHandlerFromString = function ( mock ) {
    let handler = (req, res) => {
        Router.addHeaders(mock, res);
        Router.addCookies(mock, res);
        let responseFile = Router.___replaceResponseParams(mock.response, req );
        if (!files.existsSync(responseFile)) {
            const error = {
                title: responseFile,
                message: "File Not Found.",
                error: {
                    status: 404
                }
            };
            res.render("error", error);
            return;
        }

        let textResponseFileContents = files.readFileSync(responseFile, mock.encoding);

        res.send(textResponseFileContents);
    };
    return handler;
};

Router.___buildBLOBFileHandlerFromString = function ( mock ) {
    let handler = (req, res) => {
        Router.addHeaders(mock, res);
        Router.addCookies(mock, res);
        let responseFile = Router.___replaceResponseParams(mock.response, req );
        console.log(responseFile);
        if (!files.existsSync(responseFile)) {
            const error = {
                title: responseFile,
                message: "File Not Found.",
                error: {
                    status: 404
                }
            };
            res.render("error", error);
            return;
        }

        let bufferResponseFileContents = files.readBLOBFileSync(responseFile);

        // res.writeHead(200, {
        //     'Content-Type': ((mock.mimeType)? mock.mimeType : Router.___guessBLOBMIMEType(responseFile)),
        //     'Content-Length': bufferResponseFileContents.length
        // });
        res.sendFile(responseFile);
        // res.end(bufferResponseFileContents);
    };
    return handler;
};

Router.___buildJSONFileHandlerFromArrayOfStrings = function (mock ) {
    let handler = (req, res) => {
        let index = Router.___getIndex( mock );
        let responseFile = Router.___replaceResponseParams(mock.response[index], req );

        Router.addHeaders(mock, res);
        Router.addCookies(mock, res);
        if (!files.existsSync(responseFile)) {
            const error = {
                title: responseFile,
                message: "File Not Found.",
                error: {
                    status: 404
                }
            };
            res.render("error", error);
            return;
        }

        let jsonResponseFileContents = files.readFileSync(responseFile, mock.encoding);
        let checkForValidJSON = JSON.parse( jsonResponseFileContents );

        res.send(jsonResponseFileContents);
        Router.___incrementIndex( mock, index );
    };
    return handler;
};

Router.___buildHandlebarsFileHandlerFromArrayOfStrings = function ( mock ) {
    let handler = (req, res) => {
        let index = Router.___getIndex( mock );
        let responseFile = Router.___replaceResponseParams(mock.response[index], req );

        Router.addHeaders(mock, res);
        Router.addCookies(mock, res);
        res.render(responseFile, mock.hbsData[index]);
        Router.___incrementIndex( mock, index );
    };
    return handler;
};

Router.___buildTextFileHandlerFromArrayOfStrings = function ( mock ) {
    let handler = (req, res) => {
        let index = Router.___getIndex( mock );
        let responseFile = Router.___replaceResponseParams(mock.response[index], req );

        Router.addHeaders(mock, res);
        Router.addCookies(mock, res);
        if (!files.existsSync(responseFile)) {
            const error = {
                title: responseFile,
                message: "File Not Found.",
                error: {
                    status: 404
                }
            };
            res.render("error", error);
            return;
        }

        let textResponseFileContents = files.readFileSync(responseFile, mock.encoding);

        res.send(textResponseFileContents);
        Router.___incrementIndex( mock, index );
    };
    return handler;
};
Router.___buildBLOBFileHandlerFromArrayOfStrings = function (mock ) {
    let handler = (req, res) => {
        let index = Router.___getIndex( mock );
        let responseFile = Router.___replaceResponseParams(mock.response[index], req );

        Router.addHeaders(mock, res);
        Router.addCookies(mock, res);
        if (!files.existsSync(responseFile)) {
            const error = {
                title: responseFile,
                message: "File Not Found.",
                error: {
                    status: 404
                }
            };
            res.render("error", error);
            return;
        }

        let bufferResponseFileContents = files.readBLOBFileSync(responseFile);

        res.writeHead(200, {
            'Content-Type': ((mock.mimeType)? mock.mimeType : Router.___guessBLOBMIMEType(responseFile)),
            'Content-disposition': 'attachment;filename=' + responseFile,
            'Content-Length': bufferResponseFileContents.length
        });
        res.end(new Buffer(bufferResponseFileContents, 'binary'));
        Router.___incrementIndex( mock, index );
    };
    return handler;
};
Router.___buildJSONFileHandlerFromObject = function ( mock ) {
    let handler = (req, res) => {
        Router.addHeaders(mock, res);
        Router.addCookies(mock, res);

        let jsonResponse = JSON.stringify(mock.response);
        let checkForValidJSON = JSON.parse( jsonResponse );

        res.send(jsonResponse);
    };
    return handler;
};

Router.___buildTextFileHandlerFromObject = function ( mock ) {
    let handler = (req, res) => {
        Router.addHeaders(mock, res);
        Router.addCookies(mock, res);

        let textResponse = ((mock.response.text)? mock.response.text : JSON.stringify(mock.response) );

        res.send(textResponse);
    };
    return handler;
};

Router.___buildJSONFileHandlerFromArrayOfObjects = function ( mock ) {
    let handler = (req, res) => {
        let index = Router.___getIndex( mock );

        Router.addHeaders(mock, res);
        Router.addCookies(mock, res);

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
        Router.addCookies(mock, res);

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
Router.___replaceResponseParams = function (responseValue, httpRequestObject ) {
    let paramIndex = responseValue.indexOf(':');
    let finalResponse = responseValue;
    if (-1 != paramIndex) {
        let param = responseValue.substr(paramIndex + 1);
        if (httpRequestObject.query[param]) {
            finalResponse = responseValue.substr(0, paramIndex) + httpRequestObject.query[param];
        }
    }
    return finalResponse;
};
Router.___guessBLOBMIMEType = function ( fileName ) {
    if (fileName.endsWith('.jpg')) return 'image/jpeg';
    if (fileName.endsWith('.jpeg')) return 'image/jpeg';
    if (fileName.endsWith('.gif')) return 'image/gif';
    if (fileName.endsWith('.gif')) return 'image/png';
    return 'application/octet-stream';
};

module.exports = Router;
