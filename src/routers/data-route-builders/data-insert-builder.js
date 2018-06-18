'use strict';
let ValidationHelper = require('./validation-helper.js');

function DataInsertBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        if (!ValidationHelper.validateUploadFile(builder, req, res)) return;

        let newData = JSON.parse(req.files.fileUploaded.data.toString());
        let data = { index: newData.index, type: newData.type, id: newData.id, body: newData.data };
        databaseConnection.insert(data).then(( response ) => {
            const success = {status: "success", operation: "Insert data to " + newData.index + "/" + newData.type + "."};
            res.status(201);
            res.send(JSON.stringify(success));
        }).catch(( err ) => {
            const error = { message: "Error inserting record. " + err, error: { status: 500 }};
            builder.sendErrorResponse(error, res);
        });
    };
}

module.exports = DataInsertBuilder;
