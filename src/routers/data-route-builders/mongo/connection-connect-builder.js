/* eslint-disable consistent-return */

const ValidationHelper = require('./mongo-validation-helper.js');

function ConnectionConnectBuilder(builder, databaseConnectionInfo) {
  if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
  return (req, res, next) => {
    const databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
    if (!databaseConnection) return next && next();
    databaseConnection.connect(databaseConnectionInfo.config).then(() => {
      res.status(200);
      res.send({ databaseConnection: databaseConnectionInfo.name, operation: 'connect', isConnected: true });
      next && next();
    });
  };
}

module.exports = ConnectionConnectBuilder;
