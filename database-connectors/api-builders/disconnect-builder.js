'use strict'

function DisconnectBuilder ( routerClass, databaseConnectionInfo ) {
    let disconnectHandler = (req, res) => {
        routerClass.addHeaders(databaseConnectionInfo, res);

        let databaseConnectionManager = req.app.locals.___extra.databaseConnectionManager;
        if (!databaseConnectionManager) {
            res.render("error", {message: "No database connection manager.", error: {status: 500}});
            return;
        }

        let databaseConnection = databaseConnectionManager.getConnector(databaseConnectionInfo.name);
        if (!databaseConnection) {
            res.render("error", {message: "No database connection.", error: {status: 500}});
            return;
        }

        databaseConnection.disconnect(databaseConnectionInfo).then(() => {
            res.send("Disconnected from " + databaseConnectionInfo.name + ".");
        });
    };

    return disconnectHandler;
}

module.exports = DisconnectBuilder;
