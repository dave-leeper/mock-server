'use strict'

function DatabaseConnectorManager ( ) {
    this.config = null;
    this.databaseConnectors = [];
}

DatabaseConnectorManager.prototype.init = function ( config ) {
    this.config = config;

    if ((!config) || (!config.databaseConnections)) {
        return;
    }

    for (let loop = 0; loop < config.databaseConnections.length; loop++) {
        let databaseConnectorInfo = config.databaseConnections[loop];
        let databaseConnectorClass = require ( './' + databaseConnectorInfo.databaseConnector );
        let databaseConnector = new databaseConnectorClass();

        databaseConnector.init(databaseConnectorInfo);
        this.databaseConnectors.push({name: databaseConnectorInfo.name, connector: databaseConnector});
    }
};

DatabaseConnectorManager.prototype.getConnector = function ( name ) {
    if ((!this.databaseConnectors) || (!this.databaseConnectors.length)) {
        return null;
    }

    for (let loop = 0; loop < this.databaseConnectors.length; loop++) {
        let databaseConnector = this.databaseConnectors[loop];

        if (name === databaseConnector.name) {
            return databaseConnector.connector;
        }
    }
    return null;
};

module.exports = DatabaseConnectorManager;
