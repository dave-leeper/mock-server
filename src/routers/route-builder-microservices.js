/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const files = require('../util/files.js');
const ServiceBase = require('../util/service-base.js');
const Log = require('../util/log.js');

class RouteBuilderMicroservices extends ServiceBase {
  connect(router, config) {
    if (!router || !router.get || !router.put || !router.post || !router.patch || !router.delete || !router.options) return false;
    if (!config || !config.microservices) return false;
    for (let loop2 = 0; loop2 < config.microservices.length; loop2++) {
      const microservice = config.microservices[loop2];
      const verb = ((microservice.verb) ? microservice.verb.toUpperCase() : 'GET');
      const microservicePath = path.resolve('./src/microservices', microservice.serviceFile);
      const handlers = [];
      const handler = (req, res, next) => {
        const microserviceClass = require(microservicePath);
        // eslint-disable-next-line new-cap
        const micro = new microserviceClass(microservice);
        this.addHeaders(microservice, req, res);
        this.addCookies(microservice, req, res);

        try {
          const params = {
            serviceInfo: microservice,
            body: req.body,
            params: req.params,
            files: req.files,
            headers: req.headers,
            cookies: req.cookies,
            req,
            pipe: req.pipe,
            busboy: req.busboy,
          };
          Log.trace(`Executing ${microservice.name} microservice.`);
          micro.do(params).then((data) => {
            Log.trace(`${microservice.name} executed successfully.`);
            if (data && data.status) res.status(data.status);
            else res.status(200);
            if (data.send) {
              if (Array.isArray(data.send)) res.send(data.send.map((x) => x));
              else res.send(data.send);
            } else if (data.fileDownloadPath) {
              res.download(data.fileDownloadPath);
              if (data.fileDeleteAfterDownload) {
                files.deleteSync(data.fileDownloadPath);
              }
            } else if (data.viewName) {
              res.render(data.viewName, data.viewObject);
            }
            next && next();
          }, (error) => {
            Log.trace(`${microservice.name} executed with error(s). ${Log.stringify(error)}`);
            if (error && error.status) res.status(error.status);
            else res.status(500);
            if (error.send) {
              if (Array.isArray(error.send)) Log.error(error.send.map((x) => x));
              else if (Log.will(Log.ERROR)) Log.error(error.send);
              if (!error.fileDownloadPath && !error.viewName) {
                if (Array.isArray(error.send)) res.send(error.send.map((x) => x));
                else res.send(error.send);
              }
            }
            if (error.fileDownloadPath) {
              res.download(error.fileDownloadPath);
            } else if (error.viewName) {
              res.render(error.viewName, error.viewObject);
            }
            res.end();
            next && next();
          });
        } catch (err) {
          const error = `Error executing microservice ${microservice.name}.`;
          if (Log.will(Log.ERROR)) Log.error(`${error} Error: ${Log.stringify(err)}`);
          res.status(500);
          res.render('error', { message: error, error: { status: 500, stack: err.stack } });
          res.end();
          next && next();
        }
      };

      if (!handler) {
        if (Log.will(Log.ERROR)) {
          Log.error(`Handler not defined for microservice ${microservice.path}.`);
          continue;
        }
      }

      const loggingBegin = this.loggingBegin(microservice);
      if (loggingBegin) handlers.push(loggingBegin);
      const authentication = this.authentication(config.authenticationStrategies, microservice.authentication, microservice);
      if (authentication) handlers.push(authentication);
      const authorization = this.authorization(config.authenticationStrategies, microservice.authorization, microservice);
      if (authorization) handlers.push(authorization);
      handlers.push(handler);
      const loggingEnd = this.loggingEnd(microservice);
      if (loggingEnd) handlers.push(loggingEnd);
      handlers.push((req, res) => {});
      if (verb === 'GET') {
        router.get(microservice.path, handlers);
      } else if (verb === 'PUT') {
        router.put(microservice.path, handlers);
      } else if (verb === 'POST') {
        router.post(microservice.path, handlers);
      } else if (verb === 'PATCH') {
        router.patch(microservice.path, handlers);
      } else if (verb === 'DELETE') {
        router.delete(microservice.path, handlers);
      } else if (verb === 'OPTIONS') {
        router.options(microservice.path, handlers);
      }
    }
    return true;
  }
}

module.exports = RouteBuilderMicroservices;
