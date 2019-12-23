/* eslint-disable consistent-return */

const ValidationHelper = require('./mongo-validation-helper.js');
const Log = require('../../../util/log.js');

function DataInsertBuilder(builder, databaseConnectionInfo) {
  if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
  return (req, res, next) => {
    const databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
    if (!databaseConnection) return next && next();
    if (!ValidationHelper.validateUploadFile(builder, req, res)) return next && next();

    const collectionName = req.params.collection;
    const newData = JSON.parse(req.files.filename.data.toString());
    databaseConnection.insert(collectionName, newData).then((response) => {
      const success = { status: 'success', operation: `Insert data to ${collectionName}.` };
      res.status(201);
      res.send(JSON.stringify(success));
      next && next();
    }).catch((err) => {
      const error = { message: `Error inserting record. ${JSON.stringify(err)}`, error: { status: 500 } };
      if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
      builder.sendErrorResponse(error, res);
      next && next();
    });
  };
}

module.exports = DataInsertBuilder;
