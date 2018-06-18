'use strict';

let log = require ( '../util/log.js' );

class DatabaseAPIBuilder {
    buildConnectionAPI(builder, router, databaseConnectionInfo) {
        let connectHandler = require("../routers/data-route-builders/connection-connect-builder.js")(builder, databaseConnectionInfo);
        if (!connectHandler) {
            if (log.will(log.ERROR)) {
                log.error("Connect handler not defined for database connection " + databaseConnectionInfo.path + ".");
                return;
            }
        }
        let pingHandler = require("../routers/data-route-builders/connection-ping-builder.js")(builder, databaseConnectionInfo);
        if (!pingHandler) {
            if (log.will(log.ERROR)) {
                log.error("Ping handler not defined for database connection " + databaseConnectionInfo.path + ".");
                return;
            }
        }
        let disconnectHandler = require("../routers/data-route-builders/connection-disconnect-builder.js")(builder, databaseConnectionInfo);
        if (!disconnectHandler) {
            if (log.will(log.ERROR)) {
                log.error("Disconnect handler not defined for database connection " + databaseConnectionInfo.path + ".");
                return;
            }
        }
        let paths = this.buildConnectionAPIPaths(databaseConnectionInfo.name);
        let connectPath = paths[0];
        let pingPath = paths[1];
        let disconnectPath = paths[2];

        router.get(connectPath, connectHandler);
        router.get(pingPath, pingHandler);
        router.get(disconnectPath, disconnectHandler);
    }

    buildConnectionAPIPaths(name) {
        let paths = [];
        if (!name) {
            return paths;
        }
        let urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        paths.push("/" + urlName + "/connection/connect");      // connect
        paths.push("/" + urlName + "/connection/ping");         // ping
        paths.push("/" + urlName + "/connection/disconnect");   // disconnect
        return paths;
    }

    buildIndexAPI(builder, router, databaseConnectionInfo) {
        let existsHandler = require("../routers/data-route-builders/index-exists-builder.js")(databaseConnectionInfo);
        if (!existsHandler) {
            if (log.will(log.ERROR)) {
                log.error("Index exists handler not defined for database connection " + databaseConnectionInfo.path + ".");
                return;
            }
        }
        let createHandler = require("../routers/data-route-builders/index-create-builder.js")(builder, databaseConnectionInfo);
        if (!createHandler) {
            if (log.will(log.ERROR)) {
                log.error("Create index handler not defined for database connection " + databaseConnectionInfo.path + ".");
                return;
            }
        }
        let dropHandler = require("../routers/data-route-builders/index-drop-builder.js")(builder, databaseConnectionInfo);
        if (!dropHandler) {
            if (log.will(log.ERROR)) {
                log.error("Drop index handler not defined for database connection " + databaseConnectionInfo.path + ".");
                return;
            }
        }
        let createMappingHandler = require("../routers/data-route-builders/index-create-mapping-builder.js")(builder, databaseConnectionInfo);
        if (!createMappingHandler) {
            if (log.will(log.ERROR)) {
                log.error("Create index mapping handler not defined for database connection " + databaseConnectionInfo.path + ".");
                return;
            }
        }
        let paths = this.buildIndexAPIPaths(databaseConnectionInfo.name);
        let existsPath = paths[0];
        let createPath = paths[1];
        let dropPath = paths[2];
        let createMappingPath = paths[3];

        router.get(existsPath, existsHandler);
        router.post(createPath, createHandler);
        router.delete(dropPath, dropHandler);
        router.post(createMappingPath, createMappingHandler);
    }

    buildIndexAPIPaths(name) {
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

    buildDataAPI(builder, router, databaseConnectionInfo) {
        let insertHandler = require("../routers/data-route-builders/data-insert-builder.js")(builder, databaseConnectionInfo);
        if (!insertHandler) {
            if (log.will(log.ERROR)) {
                log.error("Data insert handler not defined for database connection " + databaseConnectionInfo.path + ".");
                return;
            }
        }
        let updateHandler = require("../routers/data-route-builders/data-update-builder.js")(builder, databaseConnectionInfo);
        if (!updateHandler) {
            if (log.will(log.ERROR)) {
                log.error("Data update handler not defined for database connection " + databaseConnectionInfo.path + ".");
                return;
            }
        }
        let deleteHandler = require("../routers/data-route-builders/data-delete-builder.js")(builder, databaseConnectionInfo);
        if (!deleteHandler) {
            if (log.will(log.ERROR)) {
                log.error("Data delete handler not defined for database connection " + databaseConnectionInfo.path + ".");
                return;
            }
        }
        let queryHandler = require("../routers/data-route-builders/data-query-builder.js")(builder, databaseConnectionInfo);
        if (!queryHandler) {
            if (log.will(log.ERROR)) {
                log.error("Data query handler not defined for database connection " + databaseConnectionInfo.path + ".");
                return;
            }
        }
        let paths = this.buildDataAPIPaths(databaseConnectionInfo.name);
        let insertPath = paths[0];
        let updatePath = paths[1];
        let deletePath = paths[2];
        let queryPath = paths[3];

        router.post(insertPath, insertHandler);
        router.post(updatePath, updateHandler);
        router.delete(deletePath, deleteHandler);
        router.get(queryPath, queryHandler);
    }

    buildDataAPIPaths(name) {
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

module.exports = DatabaseApiBuilder;
