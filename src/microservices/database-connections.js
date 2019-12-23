const Log = require('../util/log');
const Registry = require('../util/registry');
const RouteBuilderElasticsearchDatabase = require('../routers/route-builder-elasticsearch-database');
const RouteBuilderMongoDatabase = require('../routers/route-builder-mongo-database');

class DatabaseConnections {
  do(params) {
    return new Promise((inResolve, inReject) => {
      const serverConfig = Registry.get('ServerConfig');
      if ((!serverConfig) || (!serverConfig.databaseConnections)) {
        const error = 'Error looking up database connections.';
        if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
        inReject && inReject({ status: 500, send: error });
        return;
      }
      if (serverConfig.databaseConnections.length === 0) {
        inResolve && inResolve({ status: 200, send: 'There are no database connections.' });
        return;
      }
      const result = [];
      const { databaseConnections } = serverConfig;
      for (let loop = 0; loop < databaseConnections.length; loop++) {
        const databaseConnection = databaseConnections[loop];
        let paths = [];
        if (!databaseConnection.type) {
          const error = 'Error parsing database config. No database type given.';
          if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
          inReject && inReject({ status: 500, send: error });
          return;
        }
        if (databaseConnection.type.toLowerCase() === 'elasticsearch') {
          if (databaseConnection.generateElasticsearchConnectionAPI) {
            paths = paths.concat(RouteBuilderElasticsearchDatabase.buildElasticsearchConnectionAPIPaths(databaseConnection.name));
          }
          if (databaseConnection.generateElasticsearchIndexAPI) {
            paths = paths.concat(RouteBuilderElasticsearchDatabase.buildElasticsearchIndexAPIPaths(databaseConnection.name));
          }
          if (databaseConnection.generateElasticsearchDataAPI) {
            paths = paths.concat(RouteBuilderElasticsearchDatabase.buildElasticsearchDataAPIPaths(databaseConnection.name));
          }
        } else if (databaseConnection.type.toLowerCase() === 'mongo') {
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
          name: databaseConnection.name,
          description: databaseConnection.description,
          path: paths,
        });
      }
      inResolve && inResolve({ status: 200, send: Log.stringify(result) });
    });
  }
}
module.exports = DatabaseConnections;
