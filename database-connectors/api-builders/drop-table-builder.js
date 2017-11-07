'use strict';

function DropTableBuilder ( routerClass, databaseConnectionInfo ) {
    let dropTableHandler = (req, res) => {
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

        databaseConnection.dropTable( tableName ).then(( dropResult ) => {
            res.send({ table: tableName, dropped: dropResult.acknowledged });
        }).catch( (err) => {
            res.render("error", { message: "Error dropping " + tableName + ".", error: { status: 500, stack: err.stack }});
        });
    };

    return dropTableHandler;
}

module.exports = DropTableBuilder;
