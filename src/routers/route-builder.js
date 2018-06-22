'use strict';

let RouteBuilderMocks = require ( './route-builder-mocks.js' );
let RouteBuilderMicroservices = require ( './route-builder-microservices.js' );
let RouteBuilderEndpoints = require ( './route-builder-endpoints.js' );
let RouteBuilderDatabase = require ( './route-builder-database.js' );
let Log = require ( '../util/log.js' );

class RouteBuilder {

    /**
     * @param router - Express router. This method will add routers to it.
     * @param config - The configure file for the server.
     * @param databaseConnectionCallback - Called if database connections are made. The callback
     * will be passed the promises from creating all database connections.
     * @returns Returns the express router.
     */
    static connect(router, config, databaseConnectionCallback) {
        if ((!config) || (!router)) return router;

        if (config.authentication) {
            for (let loop = 0; loop < config.authentication.length; loop++) {
                let authentication = config.authentication[loop];
                authentication.strategy = require('../authentication/' + authentication.strategyFile);
            }
        }

        let routeBuilderMocks = new RouteBuilderMocks();
        routeBuilderMocks.connect(router, config);

        let routeBuilderMicroservices = new RouteBuilderMicroservices();
        routeBuilderMicroservices.connect(router, config);

        let routeBuilderEndpoints = new RouteBuilderEndpoints();
        routeBuilderEndpoints.connect(router, config);

        let routeBuilderDatabase = new RouteBuilderDatabase();
        routeBuilderDatabase.connect(router, config, databaseConnectionCallback);

        return router;
    }
}

module.exports = RouteBuilder;
