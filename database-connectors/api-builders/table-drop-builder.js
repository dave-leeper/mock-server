'use strict';

function TableDropBuilder ( routerClass, databaseConnectionInfo ) {
    let dropTableHandler = (req, res) => {
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
        let tableName = req.params.index;
        let databaseConnectionManager = req.app.locals.___extra.databaseConnectionManager;
        let databaseConnection = databaseConnectionManager.getConnector(databaseConnectionInfo.name);
        if (!databaseConnection) {
            const error = {message: "No database connection.", error: {status: 500}};
            routerClass.sendErrorResponse(error, res);
            return;
        }

        databaseConnection.dropTable( tableName )
            .then(( dropResult ) => {
                res.status(200);
                res.send({ table: tableName, dropped: dropResult.acknowledged });
            }).catch((err) => {
                const error = { message: "Error dropping " + tableName + ".", error: { status: 500, stack: err.stack }};
                routerClass.sendErrorResponse(error, res);
            });
    };

    return dropTableHandler;
}

module.exports = TableDropBuilder;
