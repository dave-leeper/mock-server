'use strict';
let validateDatabaseConnection = require('./validate-database-connection.js');
let validateUploadFile = require('./validate-upload-file.js');

function IndexCreateBuilder( builder, databaseConnectionInfo )
{
    let createIndexHandler = (req, res) => {
        let databaseConnection = validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        if (!validateUploadFile(builder, req, res)) return;

        let indexData = JSON.parse(req.files.fileUploaded.data.toString());
        databaseConnection.createIndex( indexData ).then(() => {
            const success = {status: "success", operation: "Create index " + indexData.index};
            res.status(200);
            res.send(JSON.stringify(success));
        }).catch(( err ) => {
            const error = { message: "Error creating index. " + err.error, error: { status: 500 }};
            builder.sendErrorResponse(error, res);
        });
    };

    return createIndexHandler;
}

module.exports = IndexCreateBuilder;
