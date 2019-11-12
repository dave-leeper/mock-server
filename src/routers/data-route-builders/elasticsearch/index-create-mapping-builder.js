'use strict';
let ValidationHelper = require('./elasticsearch-validation-helper.js');
let Log = require ( '../../../util/log.js' );

function IndexCreateMappingBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        if (!ValidationHelper.validateUploadFile(builder, req, res)) return next && next();

        let mappingData = JSON.parse(req.files.filename.data.toString());
        databaseConnection.createIndexMapping( mappingData ).then(() => {
            const success = {status: "success", operation: "Create index mapping " + mappingData.index + "/" + mappingData.type + "."};
            res.status(200);
            res.send(JSON.stringify(success));
            next && next();
        }).catch(( err ) => {
            const error = { message: "Error creating index mapping. " + err.error, error: { status: 500 }};
            if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
            builder.sendErrorResponse(error, res);
            next && next();
        });
    };
}

module.exports = IndexCreateMappingBuilder;
