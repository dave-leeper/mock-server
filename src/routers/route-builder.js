'use strict';

const RouteBuilderMocks = require ( './route-builder-mocks.js' );
const RouteBuilderMicroservices = require ( './route-builder-microservices.js' );
const RouteBuilderEndpoints = require ( './route-builder-endpoints.js' );
const RouteBuilderDatabase = require ( './route-builder-database.js' );
const Registry = require ( '../util/registry.js' );
const Strings = require ( '../util/strings.js' );
const I18n = require ( '../util/i18n.js' );
const Log = require ( '../util/log.js' );
const path = require('path');

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

        RouteBuilder.buildAuthenticationStrategies(config);

        const routeBuilderMocks = new RouteBuilderMocks();
        routeBuilderMocks.connect(router, config);

        const routeBuilderMicroservices = new RouteBuilderMicroservices();
        routeBuilderMicroservices.connect(router, config);

        const routeBuilderEndpoints = new RouteBuilderEndpoints();
        routeBuilderEndpoints.connect(router, config);

        const routeBuilderDatabase = new RouteBuilderDatabase();
        routeBuilderDatabase.connect(router, config, databaseConnectionCallback);

        return router;
    }
    static buildAuthenticationStrategies(config){
        if (!config || !config.authentication) return false;
        const operation = 'RouterBuilder.buildAuthenticationStrategies';
        const passport = Registry.get('Passport');
        if (!passport) {
            const err = { operation: operation, statusType: 'error', status: 501, message: I18n.get( Strings.AUTHENTICATION_NOT_CONFIGURED )};
            Log.error(Log.stringify(err));
            return false;
        }
        config.authenticationStrategies = {};
        for (let loop = 0; loop < config.authentication.length; loop++) {
            const authentication = config.authentication[loop];
            const strategyFile = path.resolve('./src/authentication', authentication.strategyFile)
            authentication.strategy = new (require(strategyFile))( );
            passport.use(authentication.strategy.getStrategy());
            config.authenticationStrategies[authentication.name] = {};
            config.authenticationStrategies[authentication.name]. name = authentication.name;
            config.authenticationStrategies[authentication.name]. strategy = authentication.strategy;
            config.authenticationStrategies[authentication.name]. config = authentication.config;
        }
        return true;
    }
}

module.exports = RouteBuilder;
