/* eslint-disable consistent-return */
const ValidationHelper = require('./elasticsearch-validation-helper.js');
const Log = require('../../../util/log.js');

function DataDeleteBuilder(builder, databaseConnectionInfo) {
  if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
  return (req, res, next) => {
    if (!builder || !databaseConnectionInfo) return;
    const databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
    if (!databaseConnection) return next && next();
    if (!ValidationHelper.validateParams(builder, req, res)) return next && next();

    const { index } = req.params;
    const { type } = req.params;
    const { id } = req.params;
    const query = { index, type, id };
    databaseConnection.delete(query).then((response) => {
      const success = { status: 'success', operation: `Delete record from ${index}` };
      res.status(200);
      res.send(JSON.stringify(success));
      next && next();
    }).catch((err) => {
      const error = { message: `Error deleting record (index: ${index}, type: ${type}, id: ${id}). ${err.error}`, error: { status: 500 } };
      if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
      builder.sendErrorResponse(error, res);
      next && next();
    });
  };
}

module.exports = DataDeleteBuilder;
