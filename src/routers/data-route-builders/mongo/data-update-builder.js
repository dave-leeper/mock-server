'use strict';
let ValidationHelper = require('./validation-helper.js');

function DataUpdateBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        if (!ValidationHelper.validateUploadFile(builder, req, res)) return next && next();

        let data = JSON.parse(req.files.filename.data.toString());
        let collectionName = req.params.collection;
        let id = req.params.id;
        let query = { id: id };
        databaseConnection.update(collectionName, query, data).then(( response ) => {
            const success = {status: "success", operation: "Update data for " + collectionName + ":" + id};
            res.status(200);
            res.send(JSON.stringify(success));
            next && next();
        }).catch(( err ) => {
            const error = { message: "Error updating record (id: " + collectionName + ":" + id + "). " + JSON.stringify(err), error: { status: 500 }};
            builder.sendErrorResponse(error, res);
            next && next();
        });
    };
}

module.exports = DataUpdateBuilder;
