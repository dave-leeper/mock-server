'use strict';
let validateDatabaseConnection = require('./validate-database-connection.js');

function ConnectionPingBuilder ( builder, databaseConnectionInfo ) {
    let pingHandler = (req, res) => {
        let databaseConnection = validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        databaseConnection.ping(databaseConnectionInfo).then((result) => {
            res.status(200);
            res.send({databaseConnection: databaseConnectionInfo.name, operation: "ping", isConnected: result});
        });
    };

    return pingHandler;
}

module.exports = ConnectionPingBuilder;
