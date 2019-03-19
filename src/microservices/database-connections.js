let Log = require('../util/log' );
let Registry = require('../util/registry' );
let RouteBuilderElasticsearchDatabase = require('../routers/route-builder-elasticsearch-database' );
let RouteBuilderMongoDatabase = require('../routers/route-builder-mongo-database' );

class DatabaseConnections {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let serverConfig = Registry.get('ServerConfig');
            if ((!serverConfig) || (!serverConfig.databaseConnections)) {
                let error = 'Error looking up database connections.';
                Log.error(Log.stringify(error));
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
                if (!databaseConnection.type) {
                    let error = 'Error parsing database config. No database type given.';
                    Log.error(Log.stringify(error));
                    inReject && inReject({status: 500, send: error });
                    return;
                }
                if ('elasticsearch' === databaseConnection.type.toLowerCase()) {
                    if (databaseConnection.generateElasticsearchConnectionAPI) {
                        paths = paths.concat(RouteBuilderElasticsearchDatabase.buildElasticsearchConnectionAPIPaths(databaseConnection.name));
                    }
                    if (databaseConnection.generateElasticsearchIndexAPI) {
                        paths = paths.concat(RouteBuilderElasticsearchDatabase.buildElasticsearchIndexAPIPaths(databaseConnection.name));
                    }
                    if (databaseConnection.generateElasticsearchDataAPI) {
                        paths = paths.concat(RouteBuilderElasticsearchDatabase.buildElasticsearchDataAPIPaths(databaseConnection.name));
                    }
                } else if ('mongo' === databaseConnection.type.toLowerCase()) {
                    if (databaseConnection.generateMongoConnectionAPI) {
                        paths = paths.concat(RouteBuilderMongoDatabase.buildMongoConnectionAPIPaths(databaseConnection.name));
                    }
                    if (databaseConnection.generateMongoCollectionAPI) {
                        paths = paths.concat(RouteBuilderMongoDatabase.buildMongoCollectionAPIPaths(databaseConnection.name));
                    }
                    if (databaseConnection.generateMongoDataAPI) {
                        paths = paths.concat(RouteBuilderMongoDatabase.buildMongoDataAPIPaths(databaseConnection.name));
                    }
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
