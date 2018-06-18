'use strict';
let ValidationHelper = require('./validation-helper.js');

function IndexDropBuilder ( builder, databaseConnectionInfo ) {
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        if (!ValidationHelper.validateIndexParam(builder, req, databaseConnectionInfo)) return;

        let indexName = req.params.index;
        databaseConnection.dropIndex( indexName ).then(( dropResult ) => {
            res.status(200);
            res.send({ index: indexName, dropped: dropResult.acknowledged });
        }).catch((err) => {
            const error = { message: "Error dropping " + indexName + ".", error: { status: 500, stack: err.stack }};
            builder.sendErrorResponse(error, res);
        });
    };
}

module.exports = IndexDropBuilder;
