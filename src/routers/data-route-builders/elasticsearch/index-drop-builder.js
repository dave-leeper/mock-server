/* eslint-disable consistent-return */

const ValidationHelper = require('./elasticsearch-validation-helper.js');
const Log = require('../../../util/log.js');

function IndexDropBuilder(builder, databaseConnectionInfo) {
  if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
  return (req, res, next) => {
    const databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
    if (!databaseConnection) return next && next();
    if (!ValidationHelper.validateIndexParam(builder, req, databaseConnectionInfo)) return next && next();

    const indexName = req.params.index;
    databaseConnection.dropIndex(indexName).then((dropResult) => {
      res.status(200);
      res.send({ index: indexName, dropped: dropResult.acknowledged });
      next && next();
    }).catch((err) => {
      const error = { message: `Error dropping ${indexName}.`, error: { status: 500, stack: err.stack } };
      if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
      builder.sendErrorResponse(error, res);
      next && next();
    });
  };
}

module.exports = IndexDropBuilder;
