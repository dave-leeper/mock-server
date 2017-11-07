'use strict';

function TableExistsBuilder ( routerClass, databaseConnectionInfo ) {
    let tableExistsHandler = (req, res) => {
        routerClass.addHeaders(databaseConnectionInfo, res);

        if ((!req)
        || (!req.app)
        || (!req.app.locals)
        || (!req.app.locals.___extra)
        || (!req.app.locals.___extra.databaseConnectionManager)) {
            res.render("error", {message: "No database connection manager.", error: {status: 500}});
            return;
        }
        let tableName = req.params.name;
        let databaseConnectionManager = req.app.locals.___extra.databaseConnectionManager;
        let databaseConnection = databaseConnectionManager.getConnector(databaseConnectionInfo.name);
        if (!databaseConnection) {
            res.render("error", {message: "No database connection.", error: {status: 500}});
            return;
        }

        databaseConnection.tableExists( tableName ).then(( exists ) => {
            res.send({ table: tableName, exists: exists });
        }).catch(( err ) => {
            res.render("error", { message: "Error accessing " + tableName + ".", error: { status: 500, stack: err.stack }});
        });
    };

    return tableExistsHandler;
}

module.exports = TableExistsBuilder;
