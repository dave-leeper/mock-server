let Log = require('../util/log' );
let DatabaseConnectorManager = require('../database/database-connection-manager' );

class DatabaseConnections {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            if ((!params.serverConfig)
            || (!params.serverConfig.databaseConnections)) {
                let error = 'Error looking up database connections.';
                inReject && inReject({status: 500, send: error });
                return;
            }
            if (0 === params.serverConfig.databaseConnections.length) {
                inResolve && inResolve({status: 200, send: 'There are no database connections.'});
                return;
            }
            let result = [];
            let databaseConnections = params.serverConfig.databaseConnections;
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
            inResolve && inResolve({status: 200, send: Log.stringify(result)});
        });
    }
}
module.exports = DatabaseConnections;
