'use strict';

function IndexExistsBuilder ( routerClass, databaseConnectionInfo ) {
    let indexExistsHandler = (req, res) => {
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
        let indexName = req.params.index;
        let databaseConnectionManager = req.app.locals.___extra.databaseConnectionManager;
        let databaseConnection = databaseConnectionManager.getConnector(databaseConnectionInfo.name);
        if (!databaseConnection) {
            const error = {message: "No database connection.", error: {status: 500}};
            routerClass.sendErrorResponse(error, res);
            return;
        }

        databaseConnection.indexExists( indexName )
            .then(( exists ) => {
                res.status(200);
                res.send({ index: indexName, exists: exists });
            }).catch(( err ) => {
                const error = { message: "Error accessing " + indexName + ".", error: { status: 500, stack: err.stack }};
                routerClass.sendErrorResponse(error, res);
            });
    };

    return indexExistsHandler;
}

module.exports = IndexExistsBuilder;
