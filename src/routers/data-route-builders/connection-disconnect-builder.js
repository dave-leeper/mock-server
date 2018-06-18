'use strict';
let ValidationHelper = require('./validation-helper.js');

function ConnectionDisconnectBuilder ( builder, databaseConnectionInfo ) {
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        databaseConnection.disconnect(databaseConnectionInfo).then(() => {
            res.status(200);
            res.send({databaseConnection: databaseConnectionInfo.name, operation: "disconnect", isConnected: false});
        });
    };
}

module.exports = ConnectionDisconnectBuilder;
