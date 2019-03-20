'use strict';
let ValidationHelper = require('./elasticsearch-validation-helper.js');
let Log = require ( '../../../util/log.js' );

function IndexCreateBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        if (!ValidationHelper.validateUploadFile(builder, req, res)) return next && next();

        let indexData = JSON.parse(req.files.filename.data.toString());
        databaseConnection.createIndex( indexData ).then(() => {
            const success = {status: "success", operation: "Create index " + indexData.index};
            res.status(200);
            res.send(JSON.stringify(success));
            next && next();
        }).catch(( err ) => {
            const error = { message: "Error creating index. " + err.error, error: { status: 500 }};
            if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
            builder.sendErrorResponse(error, res);
            next && next();
        });
    };
}

module.exports = IndexCreateBuilder;
