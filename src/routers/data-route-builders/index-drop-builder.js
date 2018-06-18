'use strict';
let Registry = require ( '../../util/registry.js' );

function IndexDropBuilder ( builder, databaseConnectionInfo ) {
    let dropIndexHandler = (req, res) => {
        builder.addHeaders(databaseConnectionInfo, res);
        builder.addCookies(databaseConnectionInfo, res);

        let databaseConnectionManager = Registry.get('DatabaseConnectorManager');
        if (!databaseConnectionManager) {
            res.status(500);
            res.render("error", {message: "No database connection manager.", error: {status: 500}});
            return;
        }
        let indexName = req.params.index;
        let databaseConnection = databaseConnectionManager.getConnection(databaseConnectionInfo.name);
        if (!databaseConnection) {
            const error = {message: "No database connection.", error: {status: 500}};
            builder.sendErrorResponse(error, res);
            return;
        }

        databaseConnection.dropIndex( indexName )
            .then(( dropResult ) => {
                res.status(200);
                res.send({ index: indexName, dropped: dropResult.acknowledged });
            }).catch((err) => {
                const error = { message: "Error dropping " + indexName + ".", error: { status: 500, stack: err.stack }};
            builder.sendErrorResponse(error, res);
            });
    };

    return dropIndexHandler;
}

module.exports = IndexDropBuilder;
