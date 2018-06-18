'use strict';
let ValidationHelper = require('./validation-helper.js');

function ConnectionConnectBuilder( builder, databaseConnectionInfo ) {
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        databaseConnection.connect(databaseConnectionInfo).then(() => {
            res.status(200);
            res.send({databaseConnection: databaseConnectionInfo.name, operation: "connect", isConnected: true});
        });
    };
}

module.exports = ConnectionConnectBuilder;
