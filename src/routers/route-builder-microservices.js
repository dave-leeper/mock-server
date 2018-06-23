'use strict';

let ServiceBase = require ( '../util/service-base.js' );
let Log = require ( '../util/log.js' );
let path = require('path');

class RouteBuilderMicroservices extends ServiceBase {
    connect(router, config) {
        if (!router || !router.get || !router.put || !router.post || !router.patch || !router.delete || !router.options) return false;
        if (!config || !config.microservices) return false;
        for (let loop2 = 0; loop2 < config.microservices.length; loop2++) {
            let microservice = config.microservices[loop2];
            let verb = ((microservice.verb) ? microservice.verb.toUpperCase() : "GET" );
            let microservicePath = path.resolve('./src/microservices', microservice.serviceFile);
            let handlers = [];
            let handler = (req, res, next) => {
                let microserviceClass = require( microservicePath );
                let micro = new microserviceClass();
                this.addHeaders(microservice, req, res);
                this.addCookies(microservice, req, res);

                try {
                    let params = {
                        serviceInfo: microservice,
                        body: req.body,
                        params: req.params,
                        files: req.files,
                        headers: req.headers,
                        cookies: req.cookies,
                        pipe: req.pipe,
                        busboy: req.busboy,
                    };
                    Log.trace('Executing ' + microservice.name + ' microservice with service information of ' + Log.stringify(microservice));
                    micro.do(params).then(( data ) => {
                        Log.trace(microservice.name + ' executed successfully.');
                        res.status(data.status);
                        if (data.send) {
                            if (Array.isArray(data.send)) res.send(data.send.map(x => x));
                            else res.send(data.send);
                        } else if (data.fileDownloadPath) {
                            res.download(data.fileDownloadPath);
                        } else if (data.viewName) {
                            res.render( data.viewName, data.viewObject );
                        }
                    }, ( error ) => {
                        Log.trace(microservice.name + ' executed with error(s).');
                        res.status(error.status);
                        if (error.send) {
                            if (Array.isArray(error.send)) Log.error(error.send.map(x => x));
                            else Log.error(error.send);
                            if (!error.fileDownloadPath && !error.viewName)  {
                                if (Array.isArray(error.send)) res.send(error.send.map(x => x));
                                else res.send(error.send);
                            }
                        }
                        if (error.fileDownloadPath) {
                            res.download(error.fileDownloadPath);
                        } else if (error.viewName) {
                            res.render( error.viewName, error.viewObject );
                        }
                    });
                } catch (err) {
                    let error = 'Error executing microservice ' + microservice.name + '.';
                    Log.error(error + ' Error: ' + Log.stringify(err));
                    res.status(500);
                    res.render("error", { message: error, error: { status: 500, stack: err.stack }});
                }
            };

            if (!handler) {
                if (Log.will(Log.ERROR)) {
                    Log.error("Handler not defined for microservice " + microservice.path + ".");
                    continue;
                }
            }

            let authentication = this.authentication(config.authenticationStrategies, microservice.authentication);
            if (authentication) handlers.push(authentication);
            handlers.push(handler);
            if ("GET" === verb) {
                router.get(microservice.path, handlers);
            } else if ("PUT" === verb) {
                router.put(microservice.path, handlers);
            } else if ("POST" === verb) {
                router.post(microservice.path, handlers);
            } else if ("PATCH" === verb) {
                router.patch(microservice.path, handlers);
            } else if ("DELETE" === verb) {
                router.delete(microservice.path, handlers);
            } else if ("OPTIONS" === verb) {
                router.options(microservice.path, handlers);
            }
        }
        return true;
    }
}

module.exports = RouteBuilderMicroservices;