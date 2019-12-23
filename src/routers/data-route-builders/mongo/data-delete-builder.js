/* eslint-disable consistent-return */

const ValidationHelper = require('./mongo-validation-helper.js');
const QueryHelper = require('./mongo-query-helper.js');
const Log = require('../../../util/log.js');

function DataDeleteBuilder(builder, databaseConnectionInfo) {
  if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
  return (req, res, next) => {
    if (!builder || !databaseConnectionInfo) return;
    const databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
    if (!databaseConnection) return next && next();
    if (!ValidationHelper.validateParams(builder, req, res)) return next && next();

    const collectionName = req.params.collection;
    const query = QueryHelper.getQuery(req);
    databaseConnection.delete(collectionName, query).then((response) => {
      const success = { status: 'success', operation: `Delete record from ${collectionName}` };
      res.status(200);
      res.send(JSON.stringify(success));
      next && next();
    }).catch((err) => {
      const error = { message: `Error deleting record (collection: ${collectionName}, id: ${id}). ${err.error}`, error: { status: 500 } };
      if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
      builder.sendErrorResponse(error, res);
      next && next();
    });
  };
}

module.exports = DataDeleteBuilder;
