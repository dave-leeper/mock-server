const ValidationHelper = require('./elasticsearch-validation-helper.js');

function ConnectionPingBuilder(builder, databaseConnectionInfo) {
  if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
  // eslint-disable-next-line consistent-return
  return (req, res, next) => {
    const databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
    if (!databaseConnection) return next && next();
    databaseConnection.ping().then((result) => {
      res.status(200);
      res.send({ databaseConnection: databaseConnectionInfo.name, operation: 'ping', isConnected: result });
      next && next();
    });
  };
}

module.exports = ConnectionPingBuilder;
