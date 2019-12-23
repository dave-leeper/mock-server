
const Registry = require('../../../util/registry.js');

function ElasticsearchValidationHelper() {}

ElasticsearchValidationHelper.validateBuilder = function (builder) {
  if (!builder) return false;
  if (!builder.addHeaders) return false;
  if (!builder.addCookies) return false;
  return (!!builder.sendErrorResponse);
};

ElasticsearchValidationHelper.validateDatabaseConnection = function (builder, req, res, databaseConnectionInfo) {
  if (!builder || !res || !databaseConnectionInfo) return null;
  builder.addHeaders(databaseConnectionInfo, req, res);
  builder.addCookies(databaseConnectionInfo, req, res);
  const databaseConnectionName = databaseConnectionInfo.name;
  const databaseConnectionManager = Registry.get('DatabaseConnectorManager');
  if (!databaseConnectionManager) {
    const error = { message: 'No database connection manager.', error: { status: 500 } };
    builder.sendErrorResponse(error, res);
    return null;
  }
  const databaseConnection = databaseConnectionManager.getConnection(databaseConnectionName);
  if (!databaseConnection) {
    const error = { message: `Error connecting to database. No connection found for ${databaseConnectionName}.`, error: { status: 404 } };
    builder.sendErrorResponse(error, res);
    return null;
  }
  return databaseConnection;
};

ElasticsearchValidationHelper.validateDatabaseConnectionInfo = function (databaseConnectionInfo) {
  if (!databaseConnectionInfo) return false;
  return (!!databaseConnectionInfo.name && !!databaseConnectionInfo.type);
};

ElasticsearchValidationHelper.validateIndexParam = function (builder, req, res) {
  if (!req.params.index) {
    const error = { message: 'Error, no index name provided.', error: { status: 400 } };
    builder.sendErrorResponse(error, res);
    return false;
  }
  return true;
};

ElasticsearchValidationHelper.validateParams = function (builder, req, res) {
  if (!req.params.index) {
    const error = { message: 'Error, no index name provided.', error: { status: 400 } };
    builder.sendErrorResponse(error, res);
    return false;
  }
  if (!req.params.type) {
    const error = { message: 'Error, no data type provided.', error: { status: 400 } };
    builder.sendErrorResponse(error, res);
    return false;
  }
  if (!req.params.id) {
    const error = { message: 'Error, no record id provided.', error: { status: 400 } };
    builder.sendErrorResponse(error, res);
    return false;
  }
  return true;
};

ElasticsearchValidationHelper.validateUploadFile = function (builder, req, res) {
  if ((!req.files)
    || (!req.files.filename)
    || (!req.files.filename.data)) {
    const error = { message: 'Error, no file was uploaded.', error: { status: 400 } };
    builder.sendErrorResponse(error, res);
    return false;
  }
  return true;
};

module.exports = ElasticsearchValidationHelper;
