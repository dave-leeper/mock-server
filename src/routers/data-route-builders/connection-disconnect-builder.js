'use strict';
let validateDatabaseConnection = require('./validate-database-connection.js');

function ConnectionDisconnectBuilder ( builder, databaseConnectionInfo ) {
    let disconnectHandler = (req, res) => {
        let databaseConnection = validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        databaseConnection.disconnect(databaseConnectionInfo).then(() => {
            res.status(200);
            res.send({databaseConnection: databaseConnectionInfo.name, operation: "disconnect", isConnected: false});
        });
    };
    return disconnectHandler;
}

module.exports = ConnectionDisconnectBuilder;
