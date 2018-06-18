'use strict';
let validateDatabaseConnection = require('./validate-database-connection.js');
let validateUploadFile = require('./validate-upload-file.js');

function IndexCreateMappingBuilder( builder, databaseConnectionInfo )
{
    let createIndexMappingHandler = (req, res) => {
        let databaseConnection = validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        if (!validateUploadFile(builder, req, res)) return;

        let mappingData = JSON.parse(req.files.fileUploaded.data.toString());
        databaseConnection.createIndexMapping( mappingData ).then(() => {
            const success = {status: "success", operation: "Create index mapping " + mappingData.index + "/" + mappingData.type + "."};
            res.status(200);
            res.send(JSON.stringify(success));
        }).catch(( err ) => {
            const error = { message: "Error creating index mapping. " + err.error, error: { status: 500 }};
            builder.sendErrorResponse(error, res);
        });
    };

    return createIndexMappingHandler;
}

module.exports = IndexCreateMappingBuilder;
