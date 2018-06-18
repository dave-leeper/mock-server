'use strict';
let Registry = require ( '../../util/registry.js' );

function ConnectionDisconnectBuilder ( builder, databaseConnectionInfo ) {
    let disconnectHandler = (req, res) => {
        builder.addHeaders(databaseConnectionInfo, res);
        builder.addCookies(databaseConnectionInfo, res);

        let databaseConnectionManager = Registry.get('DatabaseConnectorManager');
        if (!databaseConnectionManager) {
            res.status(500);
            res.render("error", {message: "No database connection manager.", error: {status: 500}});
            return;
        }
        let databaseConnection = databaseConnectionManager.getConnection(databaseConnectionInfo.name);
        if (!databaseConnection) {
            const error = {message: "No database connection.", error: {status: 500}};
            builder.sendErrorResponse(error, res);
            return;
        }

        databaseConnection.disconnect(databaseConnectionInfo)
            .then(() => {
                res.status(200);
                res.send({databaseConnection: databaseConnectionInfo.name, operation: "disconnect", isConnected: false});
            });
    };

    return disconnectHandler;
}

module.exports = ConnectionDisconnectBuilder;
