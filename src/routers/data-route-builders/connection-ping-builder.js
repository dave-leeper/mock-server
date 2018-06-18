'use strict';
let Registry = require ( '../../util/registry.js' );

function ConnectionPingBuilder ( builder, databaseConnectionInfo ) {
    let pingHandler = (req, res) => {
        builder.addHeaders(databaseConnectionInfo, res);
        builder.addCookies(databaseConnectionInfo, res);

        let databaseConnectionManager = Registry.get('DatabaseConnectorManager');
        if (!databaseConnectionManager) {
            const error = {message: "No database connection manager.", error: {status: 500}};
            builder.sendErrorResponse(error, res);
            return;
        }
        let databaseConnection = databaseConnectionManager.getConnection(databaseConnectionInfo.name);
        if (!databaseConnection) {
            const error = {message: "No database connection.", error: {status: 500}};
            builder.sendErrorResponse(error, res);
            return;
        }

        databaseConnection.ping(databaseConnectionInfo)
            .then((result) => {
                res.status(200);
                res.send({databaseConnection: databaseConnectionInfo.name, operation: "ping", isConnected: result});
            });
    };

    return pingHandler;
}

module.exports = ConnectionPingBuilder;
