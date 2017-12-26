'use strict';

function DatabasePingBuilder ( routerClass, databaseConnectionInfo ) {
    let pingHandler = (req, res) => {
        routerClass.addHeaders(databaseConnectionInfo, res);

        if ((!req)
        || (!req.app)
        || (!req.app.locals)
        || (!req.app.locals.___extra)
        || (!req.app.locals.___extra.databaseConnectionManager)) {
            const error = {message: "No database connection manager.", error: {status: 500}};
            routerClass.sendErrorResponse(error, res);
            return;
        }
        let databaseConnectionManager = req.app.locals.___extra.databaseConnectionManager;
        let databaseConnection = databaseConnectionManager.getConnector(databaseConnectionInfo.name);
        if (!databaseConnection) {
            const error = {message: "No database connection.", error: {status: 500}};
            routerClass.sendErrorResponse(error, res);
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

module.exports = DatabasePingBuilder;
