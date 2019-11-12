'use strict';
let ValidationHelper = require('./mongo-validation-helper.js');
let QueryHelper = require('./mongo-query-helper.js');
let Log = require ( '../../../util/log.js' );

function DataQueryBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        if (!ValidationHelper.validateParams(builder, req, res)) return next && next();

        let collectionName = req.params.collection;
        let query = QueryHelper.getQuery(req);

        databaseConnection.read(collectionName, query).then(( response ) => {
            const success = { status: "success", data: formatQueryResults( response )};
            res.status(200);
            res.send(JSON.stringify(success));
            next && next();
        }).catch(( err ) => {
            const error = { message: "Error querying database. " + JSON.stringify(err), error: { status: 500 }};
            if (Log.will(Log.ERROR)) log.error(log.stringify(error));
            builder.sendErrorResponse(error, res);
            next && next();
        });
    };
}

function formatQueryResults( response ) {
    return response;
}

module.exports = DataQueryBuilder;
