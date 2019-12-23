/* eslint-disable consistent-return */

const ValidationHelper = require('./mongo-validation-helper.js');
const log = require('../../../util/log.js');

function CollectionExistsBuilder(builder, databaseConnectionInfo) {
  if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
  return (req, res, next) => {
    const databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
    if (!databaseConnection) return next && next();
    if (!ValidationHelper.validateCollectionParam(builder, req, databaseConnectionInfo)) return next && next();

    const collectionName = req.params.collection;
    databaseConnection.collectionExists(collectionName).then((exists) => {
      res.status(200);
      res.send({ collection: collectionName, exists });
      next && next();
    }).catch((err) => {
      const error = { message: `Error accessing ${collectionName}.`, error: { status: 500, stack: err.stack } };
      log.error(log.stringify(error));
      builder.sendErrorResponse(error, res);
      next && next();
    });
  };
}

module.exports = CollectionExistsBuilder;
