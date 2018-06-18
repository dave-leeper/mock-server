'use strict';
let validateDatabaseConnection = require('./validate-database-connection.js');

function IndexDropBuilder ( builder, databaseConnectionInfo ) {
    let dropIndexHandler = (req, res) => {
        let databaseConnection = validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        databaseConnection.dropIndex( indexName ).then(( dropResult ) => {
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
