/* eslint-disable consistent-return */

const ValidationHelper = require('./mongo-validation-helper.js');
const QueryHelper = require('./mongo-query-helper.js');
const Log = require('../../../util/log.js');

function formatQueryResults(response) {
  return response;
}

function DataQueryBuilder(builder, databaseConnectionInfo) {
  if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
  return (req, res, next) => {
    const databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
    if (!databaseConnection) return next && next();
    if (!ValidationHelper.validateParams(builder, req, res)) return next && next();

    const collectionName = req.params.collection;
    const query = QueryHelper.getQuery(req);

    databaseConnection.read(collectionName, query).then((response) => {
      const success = { status: 'success', data: formatQueryResults(response) };
      res.status(200);
      res.send(JSON.stringify(success));
      next && next();
    }).catch((err) => {
      const error = { message: `Error querying database. ${JSON.stringify(err)}`, error: { status: 500 } };
      if (Log.will(Log.ERROR)) log.error(log.stringify(error));
      builder.sendErrorResponse(error, res);
      next && next();
    });
  };
}

module.exports = DataQueryBuilder;
