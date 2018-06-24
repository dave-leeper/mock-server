'use strict';

let ServiceBase = require ( '../util/service-base.js' );
let DatabaseConnectorManager = require ( '../database/database-connection-manager' );
let Registry = require ( '../util/registry.js' );
let Log = require ( '../util/log.js' );
let path = require('path');

class RouteBuilderDatabase extends ServiceBase {
    /**
     * @param router - Express router. This method will add routers to it.
     * @param config - The configure file for the server.
     * @param databaseConnectionCallback - Called if database connections are made. The callback
     * will be passed the promises from creating all database connections.
     */
    connect(router, config, databaseConnectionCallback) {
        if (!router || !router.get || !router.put || !router.post || !router.patch || !router.delete || !router.options) return false;
        if (!config || !config.databaseConnections) return false;
        let databaseConnectionManager = new DatabaseConnectorManager();
        Registry.register(databaseConnectionManager, 'DatabaseConnectorManager');
        let databaseConnectionPromises = databaseConnectionManager.connect(config);

        for (let loop3 = 0; loop3 < config.databaseConnections.length; loop3++) {
            let databaseConnectionInfo = config.databaseConnections[loop3];
            if (databaseConnectionInfo.generateConnectionAPI) this.buildConnectionAPI( router, config, databaseConnectionInfo);
            if (databaseConnectionInfo.generateIndexAPI) this.buildIndexAPI( router, config, databaseConnectionInfo);
            if (databaseConnectionInfo.generateDataAPI) this.buildDataAPI( router, config, databaseConnectionInfo);
        }
        databaseConnectionCallback && databaseConnectionCallback(databaseConnectionPromises);
        return true;
    }

    buildConnectionAPI(router, config, databaseConnectionInfo) {
        let paths = RouteBuilderDatabase.buildConnectionAPIPaths(databaseConnectionInfo.name);
        let connectPath = paths[0];
        let pingPath = paths[1];
        let disconnectPath = paths[2];
        let handlerBuilderPath = path.resolve('./src/routers/data-route-builders/', 'connection-connect-builder.js');
        let handlerBuilder = require(handlerBuilderPath);
        let handlers = [];
        let authentication = this.authentication(config.authenticationStrategies, databaseConnectionInfo.authentication);
        let authorization = this.authorization(config.authenticationStrategies, databaseConnectionInfo.authorization);
        let handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Connect handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        router.get(connectPath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/', 'connection-ping-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Ping handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        router.get(pingPath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/', 'connection-disconnect-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR))Log.error('Disconnect handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        router.get(disconnectPath, handlers);
    }

    static buildConnectionAPIPaths(name) {
        let paths = [];
        if (!name) return paths;
        let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        paths.push('/' + urlName + '/connection/connect');      // connect
        paths.push('/' + urlName + '/connection/ping');         // ping
        paths.push('/' + urlName + '/connection/disconnect');   // disconnect
        return paths;
    }

    buildIndexAPI(router, config, databaseConnectionInfo) {
        let paths = RouteBuilderDatabase.buildIndexAPIPaths(databaseConnectionInfo.name);
        let existsPath = paths[0];
        let createPath = paths[1];
        let dropPath = paths[2];
        let createMappingPath = paths[3];
        let handlerBuilderPath = path.resolve('./src/routers/data-route-builders/', 'index-exists-builder.js');
        let handlerBuilder = require(handlerBuilderPath);
        let handlers = [];
        let authentication = this.authentication(config.authenticationStrategies, databaseConnectionInfo.authentication);
        let authorization = this.authorization(config.authenticationStrategies, databaseConnectionInfo.authorization);
        let handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Index exists handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        router.get(existsPath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/', 'index-create-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Create index handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        router.post(createPath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/', 'index-drop-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Drop index handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        router.delete(dropPath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/', 'index-create-mapping-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Create index mapping handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        router.post(createMappingPath, handlers);
    }

    static buildIndexAPIPaths(name) {
        let paths = [];
        if (!name) return paths;
        let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        paths.push('/' + urlName + '/index/:index/exists'); // exists
        paths.push('/' + urlName + '/index');               // create
        paths.push('/' + urlName + '/index/:index');        // drop
        paths.push('/' + urlName + '/index/mapping');       // create mapping
        return paths;
    }

    buildDataAPI(router, config, databaseConnectionInfo) {
        let paths = RouteBuilderDatabase.buildDataAPIPaths(databaseConnectionInfo.name);
        let insertPath = paths[0];
        let updatePath = paths[1];
        let deletePath = paths[2];
        let queryPath = paths[3];
        let handlerBuilderPath = path.resolve('./src/routers/data-route-builders/', 'data-insert-builder.js');
        let handlerBuilder = require(handlerBuilderPath);
        let handlers = [];
        let authentication = this.authentication(config.authenticationStrategies, databaseConnectionInfo.authentication);
        let authorization = this.authorization(config.authenticationStrategies, databaseConnectionInfo.authorization);
        let handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Data insert handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        router.post(insertPath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/', 'data-update-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Data update handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        router.post(updatePath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/', 'data-delete-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Data delete handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        router.delete(deletePath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/', 'data-query-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Data query handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        router.get(queryPath, handlers);
    }

    static buildDataAPIPaths(name) {
        let paths = [];
        if (!name) return paths;
        let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        paths.push('/' + urlName + '/data');                    // insert
        paths.push('/' + urlName + '/data/update');             // update
        paths.push('/' + urlName + '/data/:index/:type/:id');   // delete
        paths.push('/' + urlName + '/data/:index/:type/:id');   // query
        return paths;
    }
}

module.exports = RouteBuilderDatabase;
