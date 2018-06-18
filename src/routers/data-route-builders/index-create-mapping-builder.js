'use strict';
let ValidationHelper = require('./validation-helper.js');

function IndexCreateMappingBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        if (!ValidationHelper.validateUploadFile(builder, req, res)) return;

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
}

module.exports = IndexCreateMappingBuilder;
