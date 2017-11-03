'use strict'

function ConnectBuilder ( routerClass, databaseConnectionInfo ) {
    let connectHandler = (req, res) => {
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

        databaseConnection.connect(databaseConnectionInfo).then(() => {
            res.send("Connected " + databaseConnectionInfo.name + " established.");
        });
    };

    return connectHandler;
}

module.exports = ConnectBuilder;
