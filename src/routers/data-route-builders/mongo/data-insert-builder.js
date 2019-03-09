'use strict';
let ValidationHelper = require('./validation-helper.js');

function DataInsertBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        if (!ValidationHelper.validateUploadFile(builder, req, res)) return next && next();

        let collectionName = req.params.collection;
        let newData = JSON.parse(req.files.filename.data.toString());
        let data = { id: newData.id, body: newData.data };
        databaseConnection.insert(collectionName, data).then(( response ) => {
            const success = {status: "success", operation: "Insert data to " + collectionName + "."};
            res.status(201);
            res.send(JSON.stringify(success));
            next && next();
        }).catch(( err ) => {
            const error = { message: "Error inserting record. " + err, error: { status: 500 }};
            builder.sendErrorResponse(error, res);
            next && next();
        });
    };
}

module.exports = DataInsertBuilder;
