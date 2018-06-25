'use strict';
let ValidationHelper = require('./validation-helper.js');

function ConnectionPingBuilder ( builder, databaseConnectionInfo ) {
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        databaseConnection.ping(databaseConnectionInfo).then((result) => {
            res.status(200);
            res.send({databaseConnection: databaseConnectionInfo.name, operation: "ping", isConnected: result});
            next && next();
        });
    };
}

module.exports = ConnectionPingBuilder;
