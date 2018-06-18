'use strict';
let validateDatabaseConnection = require('./validate-database-connection.js');

function IndexExistsBuilder ( builder, databaseConnectionInfo ) {
    let indexExistsHandler = (req, res) => {
        let databaseConnection = validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        databaseConnection.indexExists( indexName ).then(( exists ) => {
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
