'use strict';
let ValidationHelper = require('./mongo-validation-helper.js');
let QueryHelper = require('./mongo-query-helper.js');

function DataUpdateBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        if (!ValidationHelper.validateUploadFile(builder, req, res)) return next && next();

        let data = JSON.parse(req.files.filename.data.toString());
        let collectionName = req.params.collection;
        let query = QueryHelper.getQuery(req);
        databaseConnection.update(collectionName, query, data).then(( response ) => {
            const success = {status: "success", operation: "Update data for " + collectionName + ":" + JSON.stringify(query)};
            res.status(200);
            res.send(JSON.stringify(success));
            next && next();
        }).catch(( err ) => {
            const error = { message: "Error updating record (query: " + collectionName + ":" +  JSON.stringify(query) + "). " + JSON.stringify(err), error: { status: 500 }};
            builder.sendErrorResponse(error, res);
            next && next();
        });
    };
}

module.exports = DataUpdateBuilder;
