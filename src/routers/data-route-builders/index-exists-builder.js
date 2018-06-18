'use strict';
let Registry = require ( '../../util/registry.js' );

function IndexExistsBuilder ( builder, databaseConnectionInfo ) {
    let indexExistsHandler = (req, res) => {
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

        databaseConnection.indexExists( indexName )
            .then(( exists ) => {
                res.status(200);
                res.send({ index: indexName, exists: exists });
            }).catch(( err ) => {
                const error = { message: "Error accessing " + indexName + ".", error: { status: 500, stack: err.stack }};
            builder.sendErrorResponse(error, res);
            });
    };

    return indexExistsHandler;
}

module.exports = IndexExistsBuilder;
