'use strict';

let RouteBuilderBase = require ( './route-builder-base.js' );
let DatabaseConnectorManager = require ( '../database/database-connection-manager' );
let Registry = require ( '../util/registry.js' );
let Log = require ( '../util/log.js' );

class RouteBuilderDatabase extends RouteBuilderBase {
    /**
     * @param router - Express router. This method will add routers to it.
     * @param config - The configure file for the server.
     * @param databaseConnectionCallback - Called if database connections are made. The callback
     * will be passed the promises from creating all database connections.
     */
    connect(router, config, databaseConnectionCallback) {
        if ((!config) || (!router)) return;
        if (!config.databaseConnections) return;
        let databaseConnectionManager = new DatabaseConnectorManager();
        Registry.register(databaseConnectionManager, 'DatabaseConnectorManager');
        let databaseConnectionPromises = databaseConnectionManager.connect(config);

        for (let loop3 = 0; loop3 < config.databaseConnections.length; loop3++) {
            let databaseConnectionInfo = config.databaseConnections[loop3];
            if (databaseConnectionInfo.generateConnectionAPI) this.buildConnectionAPI( router, databaseConnectionInfo);
            if (databaseConnectionInfo.generateIndexAPI) this.buildIndexAPI( router, databaseConnectionInfo);
            if (databaseConnectionInfo.generateDataAPI) this.buildDataAPI( router, databaseConnectionInfo);
        }
        databaseConnectionCallback && databaseConnectionCallback(databaseConnectionPromises);
    }

    buildConnectionAPI(router, databaseConnectionInfo) {
        let connectHandler = require("./data-route-builders/connection-connect-builder.js")(this, databaseConnectionInfo);
        if (!connectHandler) {
            if (Log.will(Log.ERROR)) {
                Log.error("Connect handler not defined for database connection " + databaseConnectionInfo.path + ".");
                return;
            }
        }
        let pingHandler = require("./data-route-builders/connection-ping-builder.js")(this, databaseConnectionInfo);
        if (!pingHandler) {
            if (Log.will(Log.ERROR)) Log.error("Ping handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
        let disconnectHandler = require("./data-route-builders/connection-disconnect-builder.js")(this, databaseConnectionInfo);
        if (!disconnectHandler) {
            if (Log.will(Log.ERROR))Log.error("Disconnect handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
        let paths = RouteBuilderDatabase.buildConnectionAPIPaths(databaseConnectionInfo.name);
        let connectPath = paths[0];
        let pingPath = paths[1];
        let disconnectPath = paths[2];

        router.get(connectPath, connectHandler);
        router.get(pingPath, pingHandler);
        router.get(disconnectPath, disconnectHandler);
    }

    static buildConnectionAPIPaths(name) {
        let paths = [];
        if (!name) return paths;
        let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        paths.push("/" + urlName + "/connection/connect");      // connect
        paths.push("/" + urlName + "/connection/ping");         // ping
        paths.push("/" + urlName + "/connection/disconnect");   // disconnect
        return paths;
    }

    buildIndexAPI(router, databaseConnectionInfo) {
        let existsHandler = require("./data-route-builders/index-exists-builder.js")(this, databaseConnectionInfo);
        if (!existsHandler)  if (Log.will(Log.ERROR)) Log.error("Index exists handler not defined for database connection " + databaseConnectionInfo.path + ".");
        let createHandler = require("./data-route-builders/index-create-builder.js")(this, databaseConnectionInfo);
        if (!createHandler) if (Log.will(Log.ERROR)) Log.error("Create index handler not defined for database connection " + databaseConnectionInfo.path + ".");
        let dropHandler = require("./data-route-builders/index-drop-builder.js")(this, databaseConnectionInfo);
        if (!dropHandler) if (Log.will(Log.ERROR)) Log.error("Drop index handler not defined for database connection " + databaseConnectionInfo.path + ".");
        let createMappingHandler = require("./data-route-builders/index-create-mapping-builder.js")(this, databaseConnectionInfo);
        if (!createMappingHandler) if (Log.will(Log.ERROR)) Log.error("Create index mapping handler not defined for database connection " + databaseConnectionInfo.path + ".");
        let paths = RouteBuilderDatabase.buildIndexAPIPaths(databaseConnectionInfo.name);
        let existsPath = paths[0];
        let createPath = paths[1];
        let dropPath = paths[2];
        let createMappingPath = paths[3];

        router.get(existsPath, existsHandler);
        router.post(createPath, createHandler);
        router.delete(dropPath, dropHandler);
        router.post(createMappingPath, createMappingHandler);
    }

    static buildIndexAPIPaths(name) {
        let paths = [];
        if (!name) {
            return paths;
        }
        let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        paths.push("/" + urlName + "/index/:index/exists"); // exists
        paths.push("/" + urlName + "/index");               // create
        paths.push("/" + urlName + "/index/:index");        // drop
        paths.push("/" + urlName + "/index/mapping");       // create mapping
        return paths;
    }

    buildDataAPI(router, databaseConnectionInfo) {
        let insertHandler = require("./data-route-builders/data-insert-builder.js")(this, databaseConnectionInfo);
        if (!insertHandler) {
            if (Log.will(Log.ERROR)) Log.error("Data insert handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
        let updateHandler = require("./data-route-builders/data-update-builder.js")(this, databaseConnectionInfo);
        if (!updateHandler) {
            if (Log.will(Log.ERROR)) Log.error("Data update handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
        let deleteHandler = require("./data-route-builders/data-delete-builder.js")(this, databaseConnectionInfo);
        if (!deleteHandler) {
            if (Log.will(Log.ERROR)) Log.error("Data delete handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
        let queryHandler = require("./data-route-builders/data-query-builder.js")(this, databaseConnectionInfo);
        if (!queryHandler) {
            if (Log.will(Log.ERROR)) Log.error("Data query handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
        let paths = RouteBuilderDatabase.buildDataAPIPaths(databaseConnectionInfo.name);
        let insertPath = paths[0];
        let updatePath = paths[1];
        let deletePath = paths[2];
        let queryPath = paths[3];

        router.post(insertPath, insertHandler);
        router.post(updatePath, updateHandler);
        router.delete(deletePath, deleteHandler);
        router.get(queryPath, queryHandler);
    }

    static buildDataAPIPaths(name) {
        let paths = [];
        if (!name) {
            return paths;
        }
        let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        paths.push("/" + urlName + "/data");                    // insert
        paths.push("/" + urlName + "/data/update");             // update
        paths.push("/" + urlName + "/data/:index/:type/:id");   // delete
        paths.push("/" + urlName + "/data/:index/:type/:id");   // query
        return paths;
    }
}

module.exports = RouteBuilderDatabase;
