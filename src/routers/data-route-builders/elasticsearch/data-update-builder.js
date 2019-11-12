'use strict';
let ValidationHelper = require('./elasticsearch-validation-helper.js');
let Log = require ( '../../../util/log.js' );

function DataUpdateBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        if (!ValidationHelper.validateUploadFile(builder, req, res)) return next && next();

        let updateDoc = JSON.parse(req.files.filename.data.toString());
        let data = { index: updateDoc.index, type: updateDoc.type, id: updateDoc.id, body: { doc: updateDoc.data }};
        databaseConnection.update(data).then(( response ) => {
            const success = {status: "success", operation: "Update data for " + updateDoc.index};
            res.status(200);
            res.send(JSON.stringify(success));
            next && next();
        }).catch(( err ) => {
            const error = { message: "Error updating record (id: " + updateDoc.id + "). " + JSON.stringify(err), error: { status: 500 }};
            if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
            builder.sendErrorResponse(error, res);
            next && next();
        });
    };
}

module.exports = DataUpdateBuilder;
