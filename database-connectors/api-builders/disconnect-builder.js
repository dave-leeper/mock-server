'use strict';

function DisconnectBuilder ( routerClass, databaseConnectionInfo ) {
    let disconnectHandler = (req, res) => {
        routerClass.addHeaders(databaseConnectionInfo, res);

        if ((!req)
        || (!req.app)
        || (!req.app.locals)
        || (!req.app.locals.___extra)
        || (!req.app.locals.___extra.databaseConnectionManager)) {
            res.render("error", {message: "No database connection manager.", error: {status: 500}});
            return;
        }
        let databaseConnectionManager = req.app.locals.___extra.databaseConnectionManager;
        let databaseConnection = databaseConnectionManager.getConnector(databaseConnectionInfo.name);
        if (!databaseConnection) {
            res.render("error", {message: "No database connection.", error: {status: 500}});
            return;
        }

        databaseConnection.disconnect(databaseConnectionInfo).then(() => {
            res.send({databaseConnection: databaseConnectionInfo.name, operation: "disconnect", isConnected: false});
        });
    };

    return disconnectHandler;
}

module.exports = DisconnectBuilder;
