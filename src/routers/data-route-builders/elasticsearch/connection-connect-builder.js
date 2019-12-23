
const ValidationHelper = require('./elasticsearch-validation-helper.js');

function ConnectionConnectBuilder(builder, databaseConnectionInfo) {
  if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
  // eslint-disable-next-line consistent-return
  return (req, res, next) => {
    const databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
    if (!databaseConnection) return next && next();
    databaseConnection.connect(databaseConnectionInfo).then(() => {
      res.status(200);
      res.send({ databaseConnection: databaseConnectionInfo.name, operation: 'connect', isConnected: true });
      next && next();
    });
  };
}

module.exports = ConnectionConnectBuilder;
