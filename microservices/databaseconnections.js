'use strict';

let DatabaseConnectorManager = require('../database-connectors/database-connector-manager.js');

/**
 * @constructor
 */
function DatabaseConnectionsService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serviceInfo - Service config info.
 */
DatabaseConnectionsService.prototype.do = function ( req, res, serviceInfo )
{
    return new Promise (( inResolve ) => {
        if ((req)
        && (req.app)
        && (req.app.locals)
        && (req.app.locals.___extra)
        && (req.app.locals.___extra.serverConfig)
        && (req.app.locals.___extra.serverConfig.databaseConnections)
        && (req.app.locals.___extra.serverConfig.databaseConnections.length)) {
        let result = [];
        let databaseConnections = req.app.locals.___extra.serverConfig.databaseConnections;

            for (let loop = 0; loop < databaseConnections.length; loop++) {
                let databaseConnection = databaseConnections[loop];
                let paths = [];

                if (databaseConnection.generateConnectionAPI) {
                    paths = paths.concat(DatabaseConnectorManager.buildConnectionAPIPaths(databaseConnection.name));
                }
                result.push({
                    "name": databaseConnection.name,
                    "description": databaseConnection.description,
                    "path": paths
                });
            }
            res.status(200);
            res.send(JSON.stringify(result));
        } else {
            res.status(200);
            res.send(JSON.stringify({"response": "No registered database connections"}));
        }
        inResolve && inResolve ( null, this );
    });
};

module.exports = DatabaseConnectionsService;
