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

            if (!end.do) {
                if (Log.will(Log.ERROR)) {
                    Log.error("Handler not defined for endpoint " + endpoint.path + ".");
                    continue;
                }
            }
            if ("GET" === verb) {
                router.get(endpoint.path, end.do);
            } else if ("PUT" === verb) {
                router.put(endpoint.path, end.do);
            } else if ("POST" === verb) {
                router.post(endpoint.path, end.do);
            } else if ("PATCH" === verb) {
                router.patch(endpoint.path, end.do);
            } else if ("DELETE" === verb) {
                router.delete(endpoint.path, end.do);
            } else if ("OPTIONS" === verb) {
                router.options(endpoint.path, end.do);
            }
        }
        return true;
    }
}

module.exports = RouteBuilderEndpoints;
