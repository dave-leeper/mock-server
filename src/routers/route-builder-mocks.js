'use strict';

let RouteBuilderBase = require ( './route-builder-base.js' );
let Files = require ( '../util/files.js' );
let Log = require ( '../util/log.js' );


class RouteBuilderMocks extends RouteBuilderBase {
    connect(router, config) {
        if (!config.mocks) return;
        for (let loop1 = 0; loop1 < config.mocks.length; loop1++) {
            let mock = config.mocks[loop1];
            let verb = ((mock.verb) ? mock.verb.toUpperCase() : "GET");
            let responseType = ((mock.responseType) ? mock.responseType.toString().toUpperCase() : "");
            let handler;

            if ("JSON" === responseType) {
                if (typeof mock.response === 'string') {
                    handler = this.___buildJSONFileHandlerFromString(mock);
                } else if ('[object Array]' === Object.prototype.toString.call(mock.response)) {
                    if ('string' === typeof mock.response[0]) {
                        handler = this.___buildJSONFileHandlerFromArrayOfStrings(mock);
                    } else if ('object' === typeof mock.response[0]) {
                        handler = this.___buildJSONFileHandlerFromArrayOfObjects(mock);
                    }
                } else if ((mock.response) && ('object' === typeof mock.response)) {
                    handler = this.___buildJSONFileHandlerFromObject(mock);
                }
            } else if ("HBS" === responseType) {
                if (typeof mock.response === 'string') {

                    handler = this.___buildHandlebarsFileHandlerFromString(mock);
                } else if ('[object Array]' === Object.prototype.toString.call(mock.response)) {
                    handler = this.___buildHandlebarsFileHandlerFromArrayOfStrings(mock);
                }
            } else if ("BLOB" === responseType) {
                if (typeof mock.response === 'string') {
                    handler = this.___buildBLOBFileHandlerFromString(mock);
                } else if ('[object Array]' === Object.prototype.toString.call(mock.response)) {
                    handler = this.___buildBLOBFileHandlerFromArrayOfStrings(mock);
                }
            } else {
                if ('string' === typeof mock.response) {
                    handler = this.___buildTextFileHandlerFromString(mock);
                } else if ('[object Array]' === Object.prototype.toString.call(mock.response)) {
                    if ('string' === typeof mock.response[0]) {
                        handler = this.___buildTextFileHandlerFromArrayOfStrings(mock);
                    } else if ('object' === typeof mock.response[0]) {
                        handler = this.___buildTextFileHandlerFromArrayOfObjects(mock);
                    }
                } else if ((mock.response) && ('object' === typeof mock.response)) {
                    handler = this.___buildTextFileHandlerFromObject(mock);
                }
            }
            if (!handler) {
                if (Log.will(Log.ERROR)) {
                    Log.error("Handler not defined for mock " + mock.path + ".");
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
                router.options(mock.path, handler);
            }
        }
    }

    ___buildJSONFileHandlerFromString(mock) {
        return (req, res) => {
            RouteBuilderMocks.___logMockRequest(mock, req);
            this.addHeaders(mock, res);
            this.addCookies(mock, res);
            let responseFile = RouteBuilderMocks.___replaceResponseParams(mock.response, req);
            if (!Files.existsSync(responseFile)) {
                const error = {
                    title: responseFile,
                    message: "File Not Found: " + responseFile + ".",
                    error: {status: 404}
                };
                res.render("error", error);
                return;
            }

            let jsonResponseFileContents = Files.readFileSync(responseFile);
            JSON.parse(jsonResponseFileContents); // Parse JSON to make sure it's valid.

            res.send(jsonResponseFileContents);
        };
    }

    ___buildHandlebarsFileHandlerFromString(mock) {
        return (req, res) => {
            RouteBuilderMocks.___logMockRequest(mock, req);
            this.addHeaders(mock, res);
            this.addCookies(mock, res);
            let responseFile = RouteBuilderMocks.___replaceResponseParams(mock.response, req);
            res.render(responseFile, mock.hbsData);
        };
    }

    ___buildTextFileHandlerFromString(mock) {
        return (req, res) => {
            RouteBuilderMocks.___logMockRequest(mock, req);
            this.addHeaders(mock, res);
            this.addCookies(mock, res);
            let responseFile = RouteBuilderMocks.___replaceResponseParams(mock.response, req);
            if (!Files.existsSync(responseFile)) {
                const error = {
                    title: responseFile,
                    message: "File Not Found.",
                    error: {status: 404}
                };
                res.render("error", error);
                return;
            }

            let textResponseFileContents = Files.readFileSync(responseFile, mock.encoding);

            res.send(textResponseFileContents);
        };
    }

    ___buildBLOBFileHandlerFromString(mock) {
        return (req, res) => {
            RouteBuilderMocks.___logMockRequest(mock, req);
            this.addHeaders(mock, res);
            this.addCookies(mock, res);
            let responseFile = RouteBuilderMocks.___replaceResponseParams(mock.response, req);
            Log.trace('Sending file: ' + responseFile + '.');
            if (!Files.existsSync(responseFile)) {
                const error = {
                    title: responseFile,
                    message: "File Not Found.",
                    error: {status: 404}
                };
                res.render("error", error);
                return;
            }

            Files.readBLOBFileSync(responseFile);
            res.sendFile(responseFile);
        };
    }

    ___buildJSONFileHandlerFromArrayOfStrings(mock) {
        return (req, res) => {
            RouteBuilderMocks.___logMockRequest(mock, req);
            let index = RouteBuilderMocks.___getIndex(mock);
            let responseFile = RouteBuilderMocks.___replaceResponseParams(mock.response[index], req);

            this.addHeaders(mock, res);
            this.addCookies(mock, res);
            if (!Files.existsSync(responseFile)) {
                const error = {
                    title: responseFile,
                    message: "File Not Found.",
                    error: {status: 404}
                };
                res.render("error", error);
                return;
            }

            let jsonResponseFileContents = Files.readFileSync(responseFile, mock.encoding);
            JSON.parse(jsonResponseFileContents); // Check for valid JSON

            res.send(jsonResponseFileContents);
            RouteBuilderMocks.___incrementIndex(mock, index);
        };
    }

    ___buildHandlebarsFileHandlerFromArrayOfStrings(mock) {
        return (req, res) => {
            RouteBuilderMocks.___logMockRequest(mock, req);
            let index = RouteBuilderMocks.___getIndex(mock);
            let responseFile = RouteBuilderMocks.___replaceResponseParams(mock.response[index], req);

            this.addHeaders(mock, res);
            this.addCookies(mock, res);
            res.render(responseFile, mock.hbsData[index]);
            RouteBuilderMocks.___incrementIndex(mock, index);
        };
    }

    ___buildTextFileHandlerFromArrayOfStrings(mock) {
        return (req, res) => {
            RouteBuilderMocks.___logMockRequest(mock, req);
            let index = RouteBuilderMocks.___getIndex(mock);
            let responseFile = RouteBuilderMocks.___replaceResponseParams(mock.response[index], req);

            this.addHeaders(mock, res);
            this.addCookies(mock, res);
            if (!Files.existsSync(responseFile)) {
                const error = {
                    title: responseFile,
                    message: "File Not Found.",
                    error: {status: 404}
                };
                res.render("error", error);
                return;
            }

            let textResponseFileContents = Files.readFileSync(responseFile, mock.encoding);

            res.send(textResponseFileContents);
            RouteBuilderMocks.___incrementIndex(mock, index);
        };
    }

    ___buildBLOBFileHandlerFromArrayOfStrings(mock) {
        return (req, res) => {
            RouteBuilderMocks.___logMockRequest(mock, req);
            let index = RouteBuilderMocks.___getIndex(mock);
            let responseFile = RouteBuilderMocks.___replaceResponseParams(mock.response[index], req);

            this.addHeaders(mock, res);
            this.addCookies(mock, res);
            if (!Files.existsSync(responseFile)) {
                const error = {
                    title: responseFile,
                    message: "File Not Found.",
                    error: {status: 404}
                };
                res.render("error", error);
                return;
            }

            let bufferResponseFileContents = Files.readBLOBFileSync(responseFile);

            res.writeHead(200, {
                'Content-Type': ((mock.mimeType) ? mock.mimeType : this.___guessBLOBMIMEType(responseFile)),
                'Content-disposition': 'attachment;filename=' + responseFile,
                'Content-Length': bufferResponseFileContents.length
            });
            res.end(new Buffer(bufferResponseFileContents, 'binary'));
            RouteBuilderMocks.___incrementIndex(mock, index);
        };
    }

    ___buildJSONFileHandlerFromObject(mock) {
        return (req, res) => {
            RouteBuilderMocks.___logMockRequest(mock, req);
            this.addHeaders(mock, res);
            this.addCookies(mock, res);

            let jsonResponse = JSON.stringify(mock.response);
            JSON.parse(jsonResponse);   // Check for valid JSON
            res.send(jsonResponse);
        };
    }

    ___buildTextFileHandlerFromObject(mock) {
        return (req, res) => {
            RouteBuilderMocks.___logMockRequest(mock, req);
            this.addHeaders(mock, res);
            this.addCookies(mock, res);

            let textResponse = ((mock.response.text) ? mock.response.text : JSON.stringify(mock.response));

            res.send(textResponse);
        };
    }

    ___buildJSONFileHandlerFromArrayOfObjects(mock) {
        return (req, res) => {
            RouteBuilderMocks.___logMockRequest(mock, req);
            let index = RouteBuilderMocks.___getIndex(mock);

            this.addHeaders(mock, res);
            this.addCookies(mock, res);

            let jsonResponse = JSON.stringify(mock.response[index]);
            JSON.parse(jsonResponse);   // Check for valid JSON
            res.send(jsonResponse);
            RouteBuilderMocks.___incrementIndex(mock, index);
        };
    }

    ___buildTextFileHandlerFromArrayOfObjects(mock) {
        return (req, res) => {
            RouteBuilderMocks.___logMockRequest(mock, req);
            let index = RouteBuilderMocks.___getIndex(mock);

            this.addHeaders(mock, res);
            this.addCookies(mock, res);

            let textResponse = ((mock.response[index].text) ? mock.response[index].text : JSON.stringify(mock.response[index]));

            res.send(textResponse);
            RouteBuilderMocks.___incrementIndex(mock, index);
        };
    }

    static ___getIndex(mock) {
        if (!mock.indexes) mock.indexes = {};
        if (!mock.indexes[mock.path]) {
            mock.indexes[mock.path] = {};
        }
        if (!mock.indexes[mock.path].___index) {
            mock.indexes[mock.path].___index = 0;
        }

        return mock.indexes[mock.path].___index;
    };

    static ___incrementIndex(mock, index) {
        index++;
        if (mock.response.length <= index) {
            index = 0;
        }
        mock.indexes[mock.path].___index = index;
    }

    static ___replaceResponseParams(responseValue, httpRequestObject) {
        let paramIndex = responseValue.indexOf(':');
        let finalResponse = responseValue;
        if (-1 !== paramIndex) {
            let param = responseValue.substr(paramIndex + 1);
            if (httpRequestObject.params[param]) {
                finalResponse = responseValue.substr(0, paramIndex) + httpRequestObject.params[param];
            }
        }
        paramIndex = finalResponse.indexOf(':');
        if (-1 !== paramIndex) {
            let param = finalResponse.substr(paramIndex + 1);
            if (httpRequestObject.query[param]) {
                finalResponse = finalResponse.substr(0, paramIndex) + httpRequestObject.query[param];
            }
        }
        return finalResponse;
    }

    static ___guessBLOBMIMEType(fileName) {
        if (fileName.endsWith('.jpg')) return 'image/jpeg';
        if (fileName.endsWith('.jpeg')) return 'image/jpeg';
        if (fileName.endsWith('.gif')) return 'image/gif';
        if (fileName.endsWith('.gif')) return 'image/png';
        return 'application/octet-stream';
    };

    static ___logMockRequest(mock, req) {
        Log.trace('Received request for mock service at ' + ((mock.verb) ? mock.verb : 'GET') + ' ' + mock.path);
    }
}

module.exports = RouteBuilderMocks;
