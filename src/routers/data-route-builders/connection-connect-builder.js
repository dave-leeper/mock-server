'use strict';
let validateDatabaseConnection = require('./validate-database-connection.js');

function ConnectionConnectBuilder( builder, databaseConnectionInfo ) {
    let connectHandler = (req, res) => {
        let databaseConnection = validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        databaseConnection.connect(databaseConnectionInfo).then(() => {
            res.status(200);
            res.send({databaseConnection: databaseConnectionInfo.name, operation: "connect", isConnected: true});
        });
    };
    return connectHandler;
}

module.exports = ConnectionConnectBuilder;
