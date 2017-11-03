'use strict'

function PingBuilder ( routerClass, databaseConnectionInfo ) {
    let pingHandler = (req, res) => {
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

        databaseConnection.ping(databaseConnectionInfo).then((result) => {
            res.send({status: result});
        });
    };

    return pingHandler;
}

module.exports = PingBuilder;
