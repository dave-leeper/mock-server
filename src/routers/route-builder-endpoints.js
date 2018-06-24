'use strict';

let ServiceBase = require ( '../util/service-base.js' );
let Log = require ( '../util/log.js' );
let path = require('path');

class RouteBuilderEndpoints extends ServiceBase {
    connect(router, config) {
        if (!router || !router.get || !router.put || !router.post || !router.patch || !router.delete || !router.options) return false;
        if (!config || !config.endpoints) return false;
        for (let loop2 = 0; loop2 < config.endpoints.length; loop2++) {
            let endpoint = config.endpoints[loop2];
            let verb = ((endpoint.verb) ? endpoint.verb.toUpperCase() : "GET" );
            let endpointPath = path.resolve('./src/endpoints', endpoint.serviceFile);
            let endpointClass = require( endpointPath );
            let end = new endpointClass(endpoint);
            let handlers = [];

            if (!end.do) {
                if (Log.will(Log.ERROR)) {
                    Log.error("Handler not defined for endpoint " + endpoint.path + ".");
                    continue;
                }
            }
            let authentication = this.authentication(config.authenticationStrategies, endpoint.authentication);
            if (authentication) handlers.push(authentication);
            let authorization = this.authorization(config.authenticationStrategies, endpoint.authorization);
            if (authorization) handlers.push(authorization);
            handlers.push(end.do);
            if ("GET" === verb) {
                router.get(endpoint.path, handlers);
            } else if ("PUT" === verb) {
                router.put(endpoint.path, handlers);
            } else if ("POST" === verb) {
                router.post(endpoint.path, handlers);
            } else if ("PATCH" === verb) {
                router.patch(endpoint.path, handlers);
            } else if ("DELETE" === verb) {
                router.delete(endpoint.path, handlers);
            } else if ("OPTIONS" === verb) {
                router.options(endpoint.path, handlers);
            }
        }
        return true;
    }
}

module.exports = RouteBuilderEndpoints;
