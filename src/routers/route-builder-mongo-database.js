'use strict';

let ServiceBase = require ( '../util/service-base.js' );
let DatabaseConnectorManager = require ( '../database/database-connection-manager' );
let Registry = require ( '../util/registry.js' );
let Log = require ( '../util/log.js' );
let path = require('path');
const SOURCE_PATH = './src/routers/data-route-builders/mongo/';

class RouteBuilderMongoDatabase extends ServiceBase {
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
            if (!databaseConnectionInfo.type || 'mongo' != databaseConnectionInfo.type.toLowerCase()) continue;
            if (databaseConnectionInfo.generateElasticsearchConnectionAPI) this.buildMongoConnectionAPI( router, config, databaseConnectionInfo);
            if (databaseConnectionInfo.generateElasticsearchIndexAPI) this.buildMongoCollectionAPI( router, config, databaseConnectionInfo);
            if (databaseConnectionInfo.generateElasticsearchDataAPI) this.buildMongoDataAPI( router, config, databaseConnectionInfo);
        }
        databaseConnectionCallback && databaseConnectionCallback(databaseConnectionPromises);
        return true;
    }

    buildMongoConnectionAPI(router, config, databaseConnectionInfo) {
        let paths = RouteBuilderMongoDatabase.buildMongoConnectionAPIPaths(databaseConnectionInfo.name);
        let connectPath = paths[0];
        let pingPath = paths[1];
        let disconnectPath = paths[2];
        let handlerBuilderPath = path.resolve(SOURCE_PATH, 'connection-connect-builder.js');
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

        handlerBuilderPath = path.resolve(SOURCE_PATH, 'connection-ping-builder.js');
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

        handlerBuilderPath = path.resolve(SOURCE_PATH, 'connection-disconnect-builder.js');
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

    static buildMongoConnectionAPIPaths(name) {
        let paths = [];
        if (!name) return paths;
        let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        paths.push('/' + urlName + '/connection/connect');      // connect
        paths.push('/' + urlName + '/connection/ping');         // ping
        paths.push('/' + urlName + '/connection/disconnect');   // disconnect
        return paths;
    }

    buildMongoCollectionAPI(router, config, databaseConnectionInfo) {
        let paths = RouteBuilderMongoDatabase.buildMongoCollectionAPIPaths(databaseConnectionInfo.name);
        let existsPath = paths[0];
        let createPath = paths[1];
        let dropPath = paths[2];
        let createMappingPath = paths[3];
        let handlerBuilderPath = path.resolve(SOURCE_PATH, 'collection-exists-builder.js');
        let handlerBuilder = require(handlerBuilderPath);
        let handlers = [];
        let authentication = this.authentication(config.authenticationStrategies, databaseConnectionInfo.authentication);
        let authorization = this.authorization(config.authenticationStrategies, databaseConnectionInfo.authorization);
        let loggingBegin = this.loggingBegin(databaseConnectionInfo);
        let loggingEnd = this.loggingEnd(databaseConnectionInfo);
        let handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Collection exists handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.get(existsPath, handlers);

        handlerBuilderPath = path.resolve(SOURCE_PATH, 'collection-create-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Create collection handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.post(createPath, handlers);

        handlerBuilderPath = path.resolve(SOURCE_PATH, 'collection-drop-builder.js');
        handlerBuilder = require(handlerBuilderPath);
        handlers = [];
        handler = handlerBuilder(this, databaseConnectionInfo);
        if (!handler) {
            if (Log.will(Log.ERROR)) Log.error('Drop collection handler not defined for database connection ' + databaseConnectionInfo.name + '.');
            return;
        }
        if (loggingBegin) handlers.push(loggingBegin);
        if (authentication) handlers.push(authentication);
        if (authorization) handlers.push(authorization);
        handlers.push(handler);
        if (loggingEnd) handlers.push(loggingEnd);
        handlers.push((req, res) => {});
        router.delete(dropPath, handlers);
    }

    static buildMongoCollectionAPIPaths(name) {
        let paths = [];
        if (!name) return paths;
        let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        paths.push('/' + urlName + '/collection/:collection/exists'); // exists
        paths.push('/' + urlName + '/collection');               // create
        paths.push('/' + urlName + '/collection/:collection');   // drop
        return paths;
    }

    buildMongoDataAPI(router, config, databaseConnectionInfo) {
        let paths = RouteBuilderMongoDatabase.buildMongoDataAPIPaths(databaseConnectionInfo.name);
        let insertPath = paths[0];
        let updatePath = paths[1];
        let deletePath = paths[2];
        let queryPath = paths[3];
        let handlerBuilderPath = path.resolve(SOURCE_PATH, 'data-insert-builder.js');
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

        handlerBuilderPath = path.resolve(SOURCE_PATH, 'data-update-builder.js');
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

        handlerBuilderPath = path.resolve(SOURCE_PATH, 'data-delete-builder.js');
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

        handlerBuilderPath = path.resolve(SOURCE_PATH, 'data-query-builder.js');
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

    static buildMongoDataAPIPaths(name) {
        let paths = [];
        if (!name) return paths;
        let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        paths.push('/' + urlName + '/data');                      // insert
        paths.push('/' + urlName + '/data/update');               // update
        paths.push('/' + urlName + '/data/:collection/:id');      // delete
        paths.push('/' + urlName + '/data/:collection/:id');      // query
        return paths;
    }
}

module.exports = RouteBuilderMongoDatabase;
