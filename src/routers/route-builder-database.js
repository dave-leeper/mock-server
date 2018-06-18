'use strict';

let Log = require ( '../util/log.js' );
let RouteBuilderBase = require ( './route-builder-base.js' );
let DatabaseConnectorManager = require ( '../database/database-connection-manager' );
let RouteBuilder = {};

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
        let databaseConnectionPromises = databaseConnectionManager.connect(config);

        for (let loop3 = 0; loop3 < config.databaseConnections.length; loop3++) {
            let databaseConnectionInfo = config.databaseConnections[loop3];
            if (databaseConnectionInfo.generateConnectionAPI) databaseConnectionManager.buildConnectionAPI( this, router, databaseConnectionInfo);
            if (databaseConnectionInfo.generateIndexAPI)  databaseConnectionManager.buildIndexAPI( this, router, databaseConnectionInfo);
            if (databaseConnectionInfo.generateDataAPI)  databaseConnectionManager.buildDataAPI( this, router, databaseConnectionInfo);
        }
        databaseConnectionCallback && databaseConnectionCallback(databaseConnectionPromises);
    }
}

module.exports = RouteBuilderDatabase;
