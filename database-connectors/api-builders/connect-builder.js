'use strict';

function ConnectBuilder ( routerClass, databaseConnectionInfo ) {
    let connectHandler = (req, res) => {
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

        databaseConnection.connect(databaseConnectionInfo).then(() => {
            res.status(200);
            res.send({databaseConnection: databaseConnectionInfo.name, operation: "connect", isConnected: true});
        });
    };

    return connectHandler;
}

module.exports = ConnectBuilder;
