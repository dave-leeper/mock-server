'use strict';
let ValidationHelper = require('./validation-helper.js');

function CollectionCreateBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        if (!ValidationHelper.validateUploadFile(builder, req, res)) return next && next();

        let collectionData = JSON.parse(req.files.filename.data.toString());
        databaseConnection.createCollection( collectionData ).then(() => {
            const success = {status: "success", operation: "Create index " + collectionData.collection};
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
