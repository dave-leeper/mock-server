'use strict';
let ValidationHelper = require('./validation-helper.js');

function DataUpdateBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        if (!ValidationHelper.validateUploadFile(builder, req, res)) return;

        let updateDoc = JSON.parse(req.files.filename.data.toString());
        let data = { index: updateDoc.index, type: updateDoc.type, id: updateDoc.id, body: { doc: updateDoc.data }};
        databaseConnection.update(data).then(( response ) => {
            const success = {status: "success", operation: "Update data for " + updateDoc.index};
            res.status(200);
            res.send(JSON.stringify(success));
        }).catch(( err ) => {
            const error = { message: "Error updating record (id: " + updateDoc.id + "). " + JSON.stringify(err), error: { status: 500 }};
            builder.sendErrorResponse(error, res);
        });
    };
}

module.exports = DataUpdateBuilder;
