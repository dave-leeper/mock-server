'use strict';
let RouteBuilderBase = require ( '../route-builder-base.js' );

function DatabaseConnectBuilder( builder, databaseConnectionInfo ) {
    let connectHandler = (req, res) => {
        builder.addHeaders(databaseConnectionInfo, res);
        builder.addCookies(databaseConnectionInfo, res);

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
        let databaseConnection = databaseConnectionManager.getConnection(databaseConnectionInfo.name);
        if (!databaseConnection) {
            const error = {message: "No database connection.", error: {status: 500}};
            builder.sendErrorResponse(error, res);
            return;
        }

        databaseConnection.connect(databaseConnectionInfo)
            .then(() => {
                res.status(200);
                res.send({databaseConnection: databaseConnectionInfo.name, operation: "connect", isConnected: true});
            });
    };

    return connectHandler;
}

module.exports = DatabaseConnectBuilder;
