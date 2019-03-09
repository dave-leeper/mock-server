'use strict';
let ValidationHelper = require('./validation-helper.js');

function CollectionCreateBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        if (!ValidationHelper.validateCollectionParam(builder, req, databaseConnectionInfo)) return next && next();;

        let collectionName = req.params.collection;
        databaseConnection.createCollection( collectionName ).then(() => {
            const success = {status: "success", operation: "Create collection " + collectionName};
            res.status(200);
            res.send(JSON.stringify(success));
            next && next();
        }).catch(( err ) => {
            const error = { message: "Error creating collection. " + err.error, error: { status: 500 }};
            builder.sendErrorResponse(error, res);
            next && next();
        });
    };
}

module.exports = CollectionCreateBuilder;
