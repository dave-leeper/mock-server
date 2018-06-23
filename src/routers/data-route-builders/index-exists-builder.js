'use strict';
let ValidationHelper = require('./validation-helper.js');

function IndexExistsBuilder ( builder, databaseConnectionInfo ) {
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return;
        if (!ValidationHelper.validateIndexParam(builder, req, databaseConnectionInfo)) return;

        let indexName = req.params.index;
        databaseConnection.indexExists( indexName ).then(( exists ) => {
            res.status(200);
            res.send({ index: indexName, exists: exists });
        }).catch(( err ) => {
            const error = { message: "Error accessing " + indexName + ".", error: { status: 500, stack: err.stack }};
            builder.sendErrorResponse(error, res);
        });
    };
}

module.exports = IndexExistsBuilder;
