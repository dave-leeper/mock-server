'use strict';
let ValidationHelper = require('./mongo-validation-helper.js');
let QueryHelper = require('./mongo-query-helper.js');
let log = require ( '../../../util/log.js' );

function DataDeleteBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        if (!builder || !databaseConnectionInfo) return;
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        if (!ValidationHelper.validateParams(builder, req, res)) return next && next();

        let collectionName = req.params.collection;
        let query = QueryHelper.getQuery(req);
        databaseConnection.delete( collectionName, query ).then(( response ) => {
            const success = {status: "success", operation: "Delete record from " + collectionName};
            res.status(200);
            res.send(JSON.stringify(success));
            next && next();
        }).catch(( err ) => {
            const error = { message: "Error deleting record (collection: " + collectionName + ", id: " + id + "). " + err.error, error: { status: 500 }};
            log.error(log.stringify(error));
            builder.sendErrorResponse(error, res);
            next && next();
        });
    };
}

module.exports = DataDeleteBuilder;
