let Log = require('../util/log' );
let Registry = require('../util/registry' );
let RouteBuilderDatabase = require('../routers/route-builder-database' );

class DatabaseConnections {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let serverConfig = Registry.get('ServerConfig');
            if ((!serverConfig) || (!serverConfig.databaseConnections)) {
                let error = 'Error looking up database connections.';
                inReject && inReject({status: 500, send: error });
                return;
            }
            if (0 === serverConfig.databaseConnections.length) {
                inResolve && inResolve({status: 200, send: 'There are no database connections.'});
                return;
            }
            let result = [];
            let databaseConnections = serverConfig.databaseConnections;
            for (let loop = 0; loop < databaseConnections.length; loop++) {
                let databaseConnection = databaseConnections[loop];
                let paths = [];
                if (databaseConnection.generateElasticsearchConnectionAPI) {
                    paths = paths.concat(RouteBuilderDatabase.buildElasticsearchConnectionAPIPaths(databaseConnection.name));
                }
                if (databaseConnection.generateElasticsearchIndexAPI) {
                    paths = paths.concat(RouteBuilderDatabase.buildElasticsearchIndexAPIPaths(databaseConnection.name));
                }
                if (databaseConnection.generateElasticsearchDataAPI) {
                    paths = paths.concat(RouteBuilderDatabase.buildElasticsearchDataAPIPaths(databaseConnection.name));
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
