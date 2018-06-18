'use strict';
let Registry = require ( '../../util/registry.js' );

let validateDatabaseConnection = (builder, res, databaseConnectionInfo) => {
    if (!builder || !res) return null;
    builder.addHeaders(databaseConnectionInfo, res);
    builder.addCookies(databaseConnectionInfo, res);
    let databaseConnectionName = databaseConnectionInfo.name;
    if (!databaseConnectionName) {
        const error = { message: 'Error connecting to database. No connection name found.', error: { status: 500 }};
        builder.sendErrorResponse(error, res);
        return null;
    }
    let databaseConnectionManager = Registry.get('DatabaseConnectorManager');
    if (!databaseConnectionManager) {
        const error = {message: 'No database connection manager.', error: {status: 500}};
        builder.sendErrorResponse(error, res);
        return null;
    }
    let databaseConnection = databaseConnectionManager.getConnection( databaseConnectionName );
    if (!databaseConnection) {
        const error = { message: 'Error connecting to database. No connection found for ' + databaseConnectionName + '.', error: { status: 500 }};
        builder.sendErrorResponse(error, res);
        return null;
    }
    return databaseConnection
};

module.exports = validateDatabaseConnection;
