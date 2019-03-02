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
            if (databaseConnectionInfo.generateElasticsearchConnectionAPI) this.buildElasticsearchConnectionAPI( router, config, databaseConnectionInfo);
            if (databaseConnectionInfo.generateElasticsearchIndexAPI) this.buildElasticsearchIndexAPI( router, config, databaseConnectionInfo);
            if (databaseConnectionInfo.generateElasticsearchDataAPI) this.buildElasticsearchDataAPI( router, config, databaseConnectionInfo);
        }
        databaseConnectionCallback && databaseConnectionCallback(databaseConnectionPromises);
        return true;
    }

    buildElasticsearchConnectionAPI(router, config, databaseConnectionInfo) {
        let paths = RouteBuilderDatabase.buildElasticsearchConnectionAPIPaths(databaseConnectionInfo.name);
        let connectPath = paths[0];
        let pingPath = paths[1];
        let disconnectPath = paths[2];
        let handlerBuilderPath = path.resolve('./src/routers/data-route-builders/elasticsearch/', 'connection-connect-builder.js');
        let handlerBuilder = require(handlerBuilderPath);
        let handlers = [];
        let authentication = this.authentication(config.authenticationStrategies, databaseConnectionInfo.authentication);
        let authorization = this.authorization(config.authenticationStrategies, databaseConnectionInfo.authorization);
        let loggingBegin = this.loggingBegin(databaseConnectionInfo);
        let loggingEnd = this.loggingEnd(databaseConnectionInfo);
        let handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Connect handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.get(connectPath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/elasticsearch/', 'connection-ping-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Ping handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.get(pingPath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/elasticsearch/', 'connection-disconnect-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR))Log.error('Disconnect handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.get(disconnectPath, handlers);
    }

    static buildElasticsearchConnectionAPIPaths(name) {
        let paths = [];
        if (!name) return paths;
        let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        paths.push('/' + urlName + '/connection/connect');      // connect
        paths.push('/' + urlName + '/connection/ping');         // ping
        paths.push('/' + urlName + '/connection/disconnect');   // disconnect
        return paths;
    }

    buildElasticsearchIndexAPI(router, config, databaseConnectionInfo) {
        let paths = RouteBuilderDatabase.buildElasticsearchIndexAPIPaths(databaseConnectionInfo.name);
        let existsPath = paths[0];
        let createPath = paths[1];
        let dropPath = paths[2];
        let createMappingPath = paths[3];
        let handlerBuilderPath = path.resolve('./src/routers/data-route-builders/elasticsearch/', 'index-exists-builder.js');
        let handlerBuilder = require(handlerBuilderPath);
        let handlers = [];
        let authentication = this.authentication(config.authenticationStrategies, databaseConnectionInfo.authentication);
        let authorization = this.authorization(config.authenticationStrategies, databaseConnectionInfo.authorization);
        let loggingBegin = this.loggingBegin(databaseConnectionInfo);
        let loggingEnd = this.loggingEnd(databaseConnectionInfo);
        let handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Index exists handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.get(existsPath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/elasticsearch/', 'index-create-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Create index handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.post(createPath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/elasticsearch/', 'index-drop-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Drop index handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.delete(dropPath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/elasticsearch/', 'index-create-mapping-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Create index mapping handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.post(createMappingPath, handlers);
    }

    static buildElasticsearchIndexAPIPaths(name) {
        let paths = [];
        if (!name) return paths;
        let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        paths.push('/' + urlName + '/index/:index/exists'); // exists
        paths.push('/' + urlName + '/index');               // create
        paths.push('/' + urlName + '/index/:index');        // drop
        paths.push('/' + urlName + '/index/mapping');       // create mapping
        return paths;
    }

    buildElasticsearchDataAPI(router, config, databaseConnectionInfo) {
        let paths = RouteBuilderDatabase.buildElasticsearchDataAPIPaths(databaseConnectionInfo.name);
        let insertPath = paths[0];
        let updatePath = paths[1];
        let deletePath = paths[2];
        let queryPath = paths[3];
        let handlerBuilderPath = path.resolve('./src/routers/data-route-builders/elasticsearch/', 'data-insert-builder.js');
        let handlerBuilder = require(handlerBuilderPath);
        let handlers = [];
        let authentication = this.authentication(config.authenticationStrategies, databaseConnectionInfo.authentication);
        let authorization = this.authorization(config.authenticationStrategies, databaseConnectionInfo.authorization);
        let loggingBegin = this.loggingBegin(databaseConnectionInfo);
        let loggingEnd = this.loggingEnd(databaseConnectionInfo);
        let handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Data insert handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.post(insertPath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/elasticsearch/', 'data-update-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Data update handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.post(updatePath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/elasticsearch/', 'data-delete-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Data delete handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.delete(deletePath, handlers);

        handlerBuilderPath = path.resolve('./src/routers/data-route-builders/elasticsearch/', 'data-query-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Data query handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.get(queryPath, handlers);
    }

    static buildElasticsearchDataAPIPaths(name) {
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
