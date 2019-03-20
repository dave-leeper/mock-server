'use strict';
let ValidationHelper = require('./elasticsearch-validation-helper.js');
let Log = require ( '../../../util/log.js' );

function IndexExistsBuilder ( builder, databaseConnectionInfo ) {
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        if (!ValidationHelper.validateIndexParam(builder, req, databaseConnectionInfo)) return next && next();

        let indexName = req.params.index;
        databaseConnection.indexExists( indexName ).then(( exists ) => {
            res.status(200);
            res.send({ index: indexName, exists: exists });
            next && next();
        }).catch(( err ) => {
            const error = { message: "Error accessing " + indexName + ".", error: { status: 500, stack: err.stack }};
            if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
            builder.sendErrorResponse(error, res);
            next && next();
        });
    };
}

module.exports = IndexExistsBuilder;
