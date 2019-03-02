'use strict';
let ValidationHelper = require('../validation-helper.js');

function DataDeleteBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        if (!builder || !databaseConnectionInfo) return;
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        if (!ValidationHelper.validateParams(builder, req, res)) return next && next();

        let index = req.params.index;
        let type = req.params.type;
        let id = req.params.id;
        let query = { index: index, type: type, id: id };
        databaseConnection.delete( query ).then(( response ) => {
            const success = {status: "success", operation: "Delete record from " + index};
            res.status(200);
            res.send(JSON.stringify(success));
            next && next();
        }).catch(( err ) => {
            const error = { message: "Error deleting record (index: " + index + ", type: " + type + ", id: " + id + "). " + err.error, error: { status: 500 }};
            builder.sendErrorResponse(error, res);
            next && next();
        });
    };
}

module.exports = DataDeleteBuilder;
