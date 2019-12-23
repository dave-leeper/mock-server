/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */

const path = require('path');
const ServiceBase = require('../util/service-base.js');
const Files = require('../util/files.js');
const Log = require('../util/log.js');

class RouteBuilderMocks extends ServiceBase {
  connect(router, config) {
    if (!router || !router.get || !router.put || !router.post || !router.patch || !router.delete || !router.options) return false;
    if (!config || !config.mocks) return false;
    for (let loop1 = 0; loop1 < config.mocks.length; loop1++) {
      const mock = config.mocks[loop1];
      const verb = ((mock.verb) ? mock.verb.toUpperCase() : 'GET');
      const responseType = ((mock.responseType) ? mock.responseType.toString().toUpperCase() : '');
      const handlers = [];
      let handler;

      if (responseType === 'JSON') {
        if (typeof mock.response === 'string') {
          handler = this.___buildJSONFileHandlerFromString(mock);
        } else if (Object.prototype.toString.call(mock.response) === '[object Array]') {
          if (typeof mock.response[0] === 'string') {
            handler = this.___buildJSONFileHandlerFromArrayOfStrings(mock);
          } else if (typeof mock.response[0] === 'object') {
            handler = this.___buildJSONHandlerFromArrayOfObjects(mock);
          }
        } else if ((mock.response) && (typeof mock.response === 'object')) {
          handler = this.___buildJSONHandlerFromObject(mock);
        }
      } else if (responseType === 'HBS') {
        if (typeof mock.response === 'string') {
          handler = this.___buildHandlebarsFileHandlerFromString(mock);
        } else if (Object.prototype.toString.call(mock.response) === '[object Array]') {
          handler = this.___buildHandlebarsFileHandlerFromArrayOfStrings(mock);
        }
      } else if (responseType === 'BLOB') {
        if (typeof mock.response === 'string') {
          handler = this.___buildBLOBFileHandlerFromString(mock);
        } else if (Object.prototype.toString.call(mock.response) === '[object Array]') {
          handler = this.___buildBLOBFileHandlerFromArrayOfStrings(mock);
        }
      } else if (typeof mock.response === 'string') {
        handler = this.___buildTextFileHandlerFromString(mock);
      } else if (Object.prototype.toString.call(mock.response) === '[object Array]') {
        if (typeof mock.response[0] === 'string') {
          handler = this.___buildTextFileHandlerFromArrayOfStrings(mock);
        } else if (typeof mock.response[0] === 'object') {
          handler = this.___buildTextHandlerFromArrayOfObjects(mock);
        }
      } else if ((mock.response) && (typeof mock.response === 'object')) {
        handler = this.___buildTextHandlerFromObject(mock);
      }
      if (!handler) {
        if (Log.will(Log.ERROR)) {
          Log.error(`Handler not defined for mock ${mock.path}.`);
          continue;
        }
      }
      const loggingBegin = this.loggingBegin(mock);
      if (loggingBegin) handlers.push(loggingBegin);
      const authentication = this.authentication(config.authenticationStrategies, mock.authentication);
      if (authentication) handlers.push(authentication);
      const authorization = this.authorization(config.authenticationStrategies, mock.authorization);
      if (authorization) handlers.push(authorization);
      handlers.push(handler);
      const loggingEnd = this.loggingEnd(mock);
      if (loggingEnd) handlers.push(loggingEnd);
      handlers.push((req, res) => {});
      if (verb === 'GET') {
        router.get(mock.path, handlers);
      } else if (verb === 'PUT') {
        router.put(mock.path, handlers);
      } else if (verb === 'POST') {
        router.post(mock.path, handlers);
      } else if (verb === 'PATCH') {
        router.patch(mock.path, handlers);
      } else if (verb === 'DELETE') {
        router.delete(mock.path, handlers);
      } else if (verb === 'OPTIONS') {
        router.options(mock.path, handlers);
      }
    }
    return true;
  }

  ___buildJSONFileHandlerFromString(mock) {
    return (req, res, next) => {
      RouteBuilderMocks.___logMockRequest(mock, req);
      this.addHeaders(mock, req, res);
      this.addCookies(mock, req, res);
      const responseFile = RouteBuilderMocks.___replaceResponseParamsWithRequestValues(mock.response, req);
      if (!RouteBuilderMocks.___fileExists(responseFile, res)) return next && next();

      const jsonResponseFileContents = Files.readFileSync(responseFile);
      JSON.parse(jsonResponseFileContents); // Parse JSON to make sure it's valid.

      res.send(jsonResponseFileContents);
      next && next();
    };
  }

  ___buildHandlebarsFileHandlerFromString(mock) {
    return (req, res, next) => {
      RouteBuilderMocks.___logMockRequest(mock, req);
      this.addHeaders(mock, req, res);
      this.addCookies(mock, req, res);
      let responseFile = RouteBuilderMocks.___replaceResponseParamsWithRequestValues(mock.response, req);
      responseFile = path.resolve('./src/views', responseFile);
      if (!RouteBuilderMocks.___fileExists(responseFile, res)) return next && next();

      res.render(responseFile, mock.hbsData);
      next && next();
    };
  }

  ___buildTextFileHandlerFromString(mock) {
    return (req, res, next) => {
      RouteBuilderMocks.___logMockRequest(mock, req);
      this.addHeaders(mock, req, res);
      this.addCookies(mock, req, res);
      const responseFile = RouteBuilderMocks.___replaceResponseParamsWithRequestValues(mock.response, req);
      if (!RouteBuilderMocks.___fileExists(responseFile, res)) return next && next();

      const textResponseFileContents = Files.readFileSync(responseFile, mock.encoding);
      res.send(textResponseFileContents);
      next && next();
    };
  }

  ___buildBLOBFileHandlerFromString(mock) {
    return (req, res, next) => {
      RouteBuilderMocks.___logMockRequest(mock, req);
      this.addHeaders(mock, req, res);
      this.addCookies(mock, req, res);
      const responseFile = RouteBuilderMocks.___replaceResponseParamsWithRequestValues(mock.response, req);
      Log.trace(`Sending file: ${responseFile}.`);
      if (!RouteBuilderMocks.___fileExists(responseFile, res)) return next && next();

      res.sendFile(responseFile, { root: path.resolve(__dirname, '../..') });
      next && next();
    };
  }

  ___buildJSONFileHandlerFromArrayOfStrings(mock) {
    return (req, res, next) => {
      RouteBuilderMocks.___logMockRequest(mock, req);
      const index = RouteBuilderMocks.___getIndex(mock);
      const responseFile = RouteBuilderMocks.___replaceResponseParamsWithRequestValues(mock.response[index], req);

      this.addHeaders(mock, req, res);
      this.addCookies(mock, req, res);
      if (!RouteBuilderMocks.___fileExists(responseFile, res)) return next && next();

      const jsonResponseFileContents = Files.readFileSync(responseFile, mock.encoding);
      JSON.parse(jsonResponseFileContents); // Check for valid JSON
      res.send(jsonResponseFileContents);
      RouteBuilderMocks.___incrementIndex(mock, index);
      next && next();
    };
  }

  ___buildHandlebarsFileHandlerFromArrayOfStrings(mock) {
    return (req, res, next) => {
      RouteBuilderMocks.___logMockRequest(mock, req);
      const index = RouteBuilderMocks.___getIndex(mock);
      const responseFile = RouteBuilderMocks.___replaceResponseParamsWithRequestValues(mock.response[index], req);
      this.addHeaders(mock, req, res);
      this.addCookies(mock, req, res);
      if (!RouteBuilderMocks.___fileExists(responseFile, res)) return next && next();

      res.render(responseFile, mock.hbsData[index]);
      RouteBuilderMocks.___incrementIndex(mock, index);
      next && next();
    };
  }

  ___buildTextFileHandlerFromArrayOfStrings(mock) {
    return (req, res, next) => {
      RouteBuilderMocks.___logMockRequest(mock, req);
      const index = RouteBuilderMocks.___getIndex(mock);
      const responseFile = RouteBuilderMocks.___replaceResponseParamsWithRequestValues(mock.response[index], req);
      this.addHeaders(mock, req, res);
      this.addCookies(mock, req, res);
      if (!RouteBuilderMocks.___fileExists(responseFile, res)) return next && next();

      const textResponseFileContents = Files.readFileSync(responseFile, mock.encoding);

      res.send(textResponseFileContents);
      RouteBuilderMocks.___incrementIndex(mock, index);
      next && next();
    };
  }

  ___buildBLOBFileHandlerFromArrayOfStrings(mock) {
    return (req, res, next) => {
      RouteBuilderMocks.___logMockRequest(mock, req);
      const index = RouteBuilderMocks.___getIndex(mock);
      const responseFile = RouteBuilderMocks.___replaceResponseParamsWithRequestValues(mock.response[index], req);
      this.addHeaders(mock, req, res);
      this.addCookies(mock, req, res);
      if (!RouteBuilderMocks.___fileExists(responseFile, res)) return next && next();

      res.sendFile(responseFile);
      RouteBuilderMocks.___incrementIndex(mock, index);
      next && next();
    };
  }

  ___buildJSONHandlerFromObject(mock) {
    return (req, res, next) => {
      RouteBuilderMocks.___logMockRequest(mock, req);
      this.addHeaders(mock, req, res);
      this.addCookies(mock, req, res);

      const jsonResponse = JSON.stringify(mock.response);
      JSON.parse(jsonResponse); // Check for valid JSON
      res.send(jsonResponse);
      next && next();
    };
  }

  ___buildTextHandlerFromObject(mock) {
    return (req, res, next) => {
      RouteBuilderMocks.___logMockRequest(mock, req);
      this.addHeaders(mock, req, res);
      this.addCookies(mock, req, res);

      const textResponse = ((mock.response.text) ? mock.response.text : JSON.stringify(mock.response));

      res.send(textResponse);
      next && next();
    };
  }

  ___buildJSONHandlerFromArrayOfObjects(mock) {
    return (req, res, next) => {
      RouteBuilderMocks.___logMockRequest(mock, req);
      const index = RouteBuilderMocks.___getIndex(mock);

      this.addHeaders(mock, req, res);
      this.addCookies(mock, req, res);

      const jsonResponse = JSON.stringify(mock.response[index]);
      JSON.parse(jsonResponse); // Check for valid JSON
      res.send(jsonResponse);
      RouteBuilderMocks.___incrementIndex(mock, index);
      next && next();
    };
  }

  ___buildTextHandlerFromArrayOfObjects(mock) {
    return (req, res, next) => {
      RouteBuilderMocks.___logMockRequest(mock, req);
      const index = RouteBuilderMocks.___getIndex(mock);

      this.addHeaders(mock, req, res);
      this.addCookies(mock, req, res);

      const textResponse = ((mock.response[index].text) ? mock.response[index].text : JSON.stringify(mock.response[index]));

      res.send(textResponse);
      RouteBuilderMocks.___incrementIndex(mock, index);
      next && next();
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
  }

  static ___incrementIndex(mock) {
    let index = RouteBuilderMocks.___getIndex(mock);
    index++;
    if (mock.response.length <= index) index = 0; // loop back to start
    mock.indexes[mock.path].___index = index;
  }

  static ___replaceResponseParamsWithRequestValues(responseValue, httpRequestObject) {
    let finalResponse = responseValue;
    let paramIndex = finalResponse.indexOf(':');
    while (paramIndex !== -1) {
      let param = finalResponse.substr(paramIndex + 1);
      if ((param.indexOf('/') !== -1)) param = param.substring(0, param.indexOf('/'));
      const responseFront = finalResponse.substr(0, paramIndex);
      const responseBack = finalResponse.substr(paramIndex + param.length + 1);
      finalResponse = responseFront + httpRequestObject.params[param] + responseBack;
      paramIndex = finalResponse.indexOf(':');
    }
    return finalResponse;
  }

  static ___logMockRequest(mock, req) {
    if (Log.will(Log.TRACE)) Log.trace(`Received request for mock service at ${(mock.verb) ? mock.verb : 'GET'} ${mock.path}`);
  }

  static ___fileExists(responseFile, res) {
    if (Files.existsSync(responseFile)) return true;
    const error = {
      title: responseFile,
      message: `File Not Found: ${responseFile}.`,
      error: { status: 404 },
    };
    res.status(404);
    res.render('error', error);
    return false;
  }
}

module.exports = RouteBuilderMocks;
