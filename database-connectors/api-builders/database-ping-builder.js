'use strict';

function DatabasePingBuilder ( routerClass, databaseConnectionInfo ) {
    let pingHandler = (req, res) => {
        routerClass.addHeaders(databaseConnectionInfo, res);

        if ((!req)
        || (!req.app)
        || (!req.app.locals)
        || (!req.app.locals.___extra)
        || (!req.app.locals.___extra.databaseConnectionManager)) {
            res.status(500);
            res.render("error", {message: "No database connection manager.", error: {status: 500}});
            return;
        }
        let databaseConnectionManager = req.app.locals.___extra.databaseConnectionManager;
        let databaseConnection = databaseConnectionManager.getConnector(databaseConnectionInfo.name);
        if (!databaseConnection) {
            res.status(500);
            res.render("error", {message: "No database connection.", error: {status: 500}});
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
