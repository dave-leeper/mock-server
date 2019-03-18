'use strict';
let Registry = require ( '../../../util/registry.js' );

function MongoValidationHelper(){}

MongoValidationHelper.validateBuilder = function(builder) {
    if (!builder) return false;
    if (!builder.addHeaders) return false;
    if (!builder.addCookies) return false;
    return (!!builder.sendErrorResponse);
};

MongoValidationHelper.validateDatabaseConnection = function (builder, req, res, databaseConnectionInfo){
    if (!builder || !res || !databaseConnectionInfo) return null;
    builder.addHeaders(databaseConnectionInfo, req, res);
    builder.addCookies(databaseConnectionInfo, req, res);
    let databaseConnectionName = databaseConnectionInfo.name;
    let databaseConnectionManager = Registry.get('DatabaseConnectorManager');
    if (!databaseConnectionManager) {
        const error = {message: 'No database connection manager.', error: {status: 500}};
        builder.sendErrorResponse(error, res);
        return null;
    }
    let databaseConnection = databaseConnectionManager.getConnection( databaseConnectionName );
    if (!databaseConnection) {
        const error = { message: 'Error connecting to database. No connection found for ' + databaseConnectionName + '.', error: { status: 404 }};
        builder.sendErrorResponse(error, res);
        return null;
    }
    return databaseConnection
};

MongoValidationHelper.validateDatabaseConnectionInfo = function(databaseConnectionInfo) {
    if (!databaseConnectionInfo) return false;
    return (!!databaseConnectionInfo.name && !!databaseConnectionInfo.type);
};

MongoValidationHelper.validateCollectionParam = function(builder, req, res) {
    if (!req.params.collection) {
        const error = { message: "Error, no collection name provided.", error: { status: 400 }};
        builder.sendErrorResponse(error, res);
        return false;
    }
    return true;
};

MongoValidationHelper.validateParams = function(builder, req, res) {
    if (!req.params.collection) {
        const error = { message: "Error, no collection name provided.", error: { status: 400 }};
        builder.sendErrorResponse(error, res);
        return false;
    }
    // if (!req.params.id) {
    //     const error = { message: "Error, no record id provided.", error: { status: 400 }};
    //     builder.sendErrorResponse(error, res);
    //     return false;
    // }
    return true;
};

MongoValidationHelper.validateUploadFile = function(builder, req, res) {
    if ((!req.files)
    || (!req.files.filename)
    || (!req.files.filename.data)) {
        const error = { message: "Error, no file was uploaded.", error: { status: 400 }};
        builder.sendErrorResponse(error, res);
        return false;
    }
    return true;
};

module.exports = MongoValidationHelper;
