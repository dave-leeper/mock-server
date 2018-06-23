'use strict';

let RouteBuilderMocks = require ( './route-builder-mocks.js' );
let RouteBuilderMicroservices = require ( './route-builder-microservices.js' );
let RouteBuilderEndpoints = require ( './route-builder-endpoints.js' );
let RouteBuilderDatabase = require ( './route-builder-database.js' );
let Registry = require ( '../util/registry.js' );
let Strings = require ( '../util/strings.js' );
let I18n = require ( '../util/i18n.js' );
let Log = require ( '../util/log.js' );
let path = require('path');

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
        let operation = 'RouterBuilder.connect';
        if (config.authentication) {
            let passport = Registry.get('Passport');
            if (!passport) {
                const err = { operation: operation, statusType: 'error', status: 501, message: I18n.get( Strings.AUTHENTICATION_NOT_CONFIGURED )};
                Log.error(Log.stringify(err));
                return router;
            }
            config.authenticationStrategies = {};
            for (let loop = 0; loop < config.authentication.length; loop++) {
                let authentication = config.authentication[loop];
                let strategyFile = path.resolve('./src/authentication', authentication.strategyFile)
                authentication.strategy = new (require(strategyFile))();
                passport.use(authentication.strategy.getStrategy());
                config.authenticationStrategies[authentication.name] = {};
                config.authenticationStrategies[authentication.name]. name = authentication.name;
                config.authenticationStrategies[authentication.name]. strategy = authentication.strategy;
                config.authenticationStrategies[authentication.name]. config = authentication.config;
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
