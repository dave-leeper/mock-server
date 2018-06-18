'use strict';
let ValidationHelper = require('./validation-helper.js');

function IndexCreateBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        if (!ValidationHelper.validateUploadFile(builder, req, res)) return;

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
}

module.exports = IndexCreateBuilder;
