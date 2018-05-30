'use strict';

let log = require ( '../util/log.js' );

function DatabaseConnectorManager ( ) {
    this.config = null;
    this.databaseConnectors = [];
}

DatabaseConnectorManager.prototype.connect = function ( config ) {
    let promises = [];

    this.config = config;
    if ((!config) || (!config.databaseConnections)) {
        return Promise.all(promises);
    }

    for (let loop = 0; loop < config.databaseConnections.length; loop++) {
        let databaseConnectorInfo = config.databaseConnections[loop];
        let databaseConnectorClass = require ( './' + databaseConnectorInfo.databaseConnector );
        let databaseConnector = new databaseConnectorClass(databaseConnectorInfo.name);

        this.databaseConnectors.push(databaseConnector);
        promises.push(databaseConnector.connect(databaseConnectorInfo));
    }
    return Promise.all(promises);
};

DatabaseConnectorManager.prototype.disconnect = function ( ) {
    let promises = [];

    if ( this.databaseConnectors ) {
        for (let loop = 0; loop < this.databaseConnectors.length; loop++) {
            let databaseConnector = this.databaseConnectors[loop];

            promises.push(databaseConnector.disconnect());
        }
    }
    return Promise.all(promises);
};

DatabaseConnectorManager.prototype.getConnector = function ( name ) {
    if ((!this.databaseConnectors) || (!this.databaseConnectors.length)) {
        return null;
    }

    for (let loop = 0; loop < this.databaseConnectors.length; loop++) {
        let databaseConnector = this.databaseConnectors[loop];

        if (name === databaseConnector.name) {
            return databaseConnector;
        }
    }
    return null;
};

DatabaseConnectorManager.prototype.buildConnectionAPI = function ( Router, router, databaseConnectionInfo ) {
    let connectHandler = require("./api-builders/connection-connect-builder.js")( Router, databaseConnectionInfo );
    if (!connectHandler) {
        if (log.will(log.ERROR)) {
            log.error("Connect handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
    }
    let pingHandler = require("./api-builders/connection-ping-builder.js")( Router, databaseConnectionInfo );
    if (!pingHandler) {
        if (log.will(log.ERROR)) {
            log.error("Ping handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
    }
    let disconnectHandler = require("./api-builders/connection-disconnect-builder.js")( Router, databaseConnectionInfo );
    if (!disconnectHandler) {
        if (log.will(log.ERROR)) {
            log.error("Disconnect handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
    }
    let paths = DatabaseConnectorManager.buildConnectionAPIPaths(databaseConnectionInfo.name);
    let connectPath = paths[0];
    let pingPath = paths[1];
    let disconnectPath = paths[2];

    router.get(connectPath, connectHandler);
    router.get(pingPath, pingHandler);
    router.get(disconnectPath, disconnectHandler);
};

DatabaseConnectorManager.buildConnectionAPIPaths = function ( name ) {
    let paths = [];
    if ( !name ) {
        return paths;
    }
    let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    paths.push("/" + urlName + "/connection/connect");      // connect
    paths.push("/" + urlName + "/connection/ping");         // ping
    paths.push("/" + urlName + "/connection/disconnect");   // disconnect
    return paths;
};

DatabaseConnectorManager.prototype.buildIndexAPI = function (Router, router, databaseConnectionInfo ) {
    let existsHandler = require("./api-builders/index-exists-builder.js")( Router, databaseConnectionInfo );
    if (!existsHandler) {
        if (log.will(log.ERROR)) {
            log.error("Index exists handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
    }
    let createHandler = require("./api-builders/index-create-builder.js")( Router, databaseConnectionInfo );
    if (!createHandler) {
        if (log.will(log.ERROR)) {
            log.error("Create index handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
    }
    let dropHandler = require("./api-builders/index-drop-builder.js")( Router, databaseConnectionInfo );
    if (!dropHandler) {
        if (log.will(log.ERROR)) {
            log.error("Drop index handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
    }
    let createMappingHandler = require("./api-builders/index-create-mapping-builder.js")( Router, databaseConnectionInfo );
    if (!createMappingHandler) {
        if (log.will(log.ERROR)) {
            log.error("Create index mapping handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
    }
    let paths = DatabaseConnectorManager.buildIndexAPIPaths(databaseConnectionInfo.name);
    let existsPath = paths[0];
    let createPath = paths[1];
    let dropPath = paths[2];
    let createMappingPath = paths[3];

    router.get(existsPath, existsHandler);
    router.post(createPath, createHandler);
    router.delete(dropPath, dropHandler);
    router.post(createMappingPath, createMappingHandler);
};

DatabaseConnectorManager.buildIndexAPIPaths = function (name ) {
    let paths = [];
    if ( !name ) {
        return paths;
    }
    let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    paths.push("/" + urlName + "/index/:index/exists"); // exists
    paths.push("/" + urlName + "/index");               // create
    paths.push("/" + urlName + "/index/:index");        // drop
    paths.push("/" + urlName + "/index/mapping");       // create mapping
    return paths;
};

DatabaseConnectorManager.prototype.buildDataAPI = function ( Router, router, databaseConnectionInfo ) {
    let insertHandler = require("./api-builders/data-insert-builder.js")( Router, databaseConnectionInfo );
    if (!insertHandler) {
        if (log.will(log.ERROR)) {
            log.error("Data insert handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
    }
    let updateHandler = require("./api-builders/data-update-builder.js")( Router, databaseConnectionInfo );
    if (!updateHandler) {
        if (log.will(log.ERROR)) {
            log.error("Data update handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
    }
    let deleteHandler = require("./api-builders/data-delete-builder.js")( Router, databaseConnectionInfo );
    if (!deleteHandler) {
        if (log.will(log.ERROR)) {
            log.error("Data delete handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
    }
    let queryHandler = require("./api-builders/data-query-builder.js")( Router, databaseConnectionInfo );
    if (!queryHandler) {
        if (log.will(log.ERROR)) {
            log.error("Data query handler not defined for database connection " + databaseConnectionInfo.path + ".");
            return;
        }
    }
    let paths = DatabaseConnectorManager.buildDataAPIPaths(databaseConnectionInfo.name);
    let insertPath = paths[0];
    let updatePath = paths[1];
    let deletePath = paths[2];
    let queryPath = paths[3];

    router.post(insertPath, insertHandler);
    router.post(updatePath, updateHandler);
    router.delete(deletePath, deleteHandler);
    router.get(queryPath, queryHandler);
};

DatabaseConnectorManager.buildDataAPIPaths = function ( name ) {
    let paths = [];
    if ( !name ) {
        return paths;
    }
    let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    paths.push("/" + urlName + "/data");                    // insert
    paths.push("/" + urlName + "/data/update");             // update
    paths.push("/" + urlName + "/data/:index/:type/:id");   // delete
    paths.push("/" + urlName + "/data/:index/:type/:id");   // query
    return paths;
};

module.exports = DatabaseConnectorManager;
