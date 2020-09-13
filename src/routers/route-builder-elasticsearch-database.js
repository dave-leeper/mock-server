/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const ServiceBase = require('../util/service-base.js');
const DatabaseConnectorManager = require('../database/database-connection-manager');
const Registry = require('../util/registry.js');
const Log = require('../util/log.js');

const SOURCE_PATH = './src/routers/data-route-builders/elasticsearch/';

class RouteBuilderElasticsearchDatabase extends ServiceBase {
  /**
     * @param router - Express router. This method will add routers to it.
     * @param config - The configure file for the server.
     * @param databaseConnectionCallback - Called if database connections are made. The callback
     * will be passed the promises from creating all database connections.
     */
  connect(router, config, databaseConnectionCallback) {
    if (!router || !router.get || !router.put || !router.post || !router.patch || !router.delete || !router.options) return false;
    if (!config || !config.databaseConnections) return false;
    const databaseConnectionManager = new DatabaseConnectorManager();
    Registry.register(databaseConnectionManager, 'DatabaseConnectorManager');
    const databaseConnectionPromises = databaseConnectionManager.connect(config);

    for (let loop3 = 0; loop3 < config.databaseConnections.length; loop3++) {
      const databaseConnectionInfo = config.databaseConnections[loop3];
      if (!databaseConnectionInfo.type || databaseConnectionInfo.type.toLowerCase() !== 'elasticsearch') continue;
      if (databaseConnectionInfo.generateConnectionAPI) this.buildElasticsearchConnectionAPI(router, config, databaseConnectionInfo);
      if (databaseConnectionInfo.generateIndexAPI) this.buildElasticsearchIndexAPI(router, config, databaseConnectionInfo);
      if (databaseConnectionInfo.generateDataAPI) this.buildElasticsearchDataAPI(router, config, databaseConnectionInfo);
    }
    databaseConnectionCallback && databaseConnectionCallback(databaseConnectionPromises);
    return true;
  }

  buildElasticsearchConnectionAPI(router, config, databaseConnectionInfo) {
    const paths = RouteBuilderElasticsearchDatabase.buildElasticsearchConnectionAPIPaths(databaseConnectionInfo.name);
    const connectPath = paths[0];
    const pingPath = paths[1];
    const disconnectPath = paths[2];
    let handlerBuilderPath = path.resolve(SOURCE_PATH, 'connection-connect-builder.js');
    let handlerBuilder = require(handlerBuilderPath);
    let handlers = [];
    const authentication = this.authentication(config.authenticationStrategies, databaseConnectionInfo.authentication);
    const authorization = this.authorization(config.authenticationStrategies, databaseConnectionInfo.authorization);
    const loggingBegin = this.loggingBegin(databaseConnectionInfo);
    const loggingEnd = this.loggingEnd(databaseConnectionInfo);
    let handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR)) Log.error(`Connect handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.get(connectPath, handlers);

    handlerBuilderPath = path.resolve(SOURCE_PATH, 'connection-ping-builder.js');
    handlerBuilder = require(handlerBuilderPath);
    handlers = [];
    handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR)) Log.error(`Ping handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.get(pingPath, handlers);

    handlerBuilderPath = path.resolve(SOURCE_PATH, 'connection-disconnect-builder.js');
    handlerBuilder = require(handlerBuilderPath);
    handlers = [];
    handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR))Log.error(`Disconnect handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.get(disconnectPath, handlers);
  }

  static buildElasticsearchConnectionAPIPaths(name) {
    const paths = [];
    if (!name) return paths;
    const urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    paths.push(`/${urlName}/connection/connect`); // connect (GET)
    paths.push(`/${urlName}/connection/ping`); // ping (GET)
    paths.push(`/${urlName}/connection/disconnect`); // disconnect (GET)
    return paths;
  }

  buildElasticsearchIndexAPI(router, config, databaseConnectionInfo) {
    const paths = RouteBuilderElasticsearchDatabase.buildElasticsearchIndexAPIPaths(databaseConnectionInfo.name);
    const existsPath = paths[0];
    const createPath = paths[1];
    const dropPath = paths[2];
    const createMappingPath = paths[3];
    let handlerBuilderPath = path.resolve(SOURCE_PATH, 'index-exists-builder.js');
    let handlerBuilder = require(handlerBuilderPath);
    let handlers = [];
    const authentication = this.authentication(config.authenticationStrategies, databaseConnectionInfo.authentication);
    const authorization = this.authorization(config.authenticationStrategies, databaseConnectionInfo.authorization);
    const loggingBegin = this.loggingBegin(databaseConnectionInfo);
    const loggingEnd = this.loggingEnd(databaseConnectionInfo);
    let handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR)) Log.error(`Index exists handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.get(existsPath, handlers);

    handlerBuilderPath = path.resolve(SOURCE_PATH, 'index-create-builder.js');
    handlerBuilder = require(handlerBuilderPath);
    handlers = [];
    handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR)) Log.error(`Create index handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.post(createPath, handlers);

    handlerBuilderPath = path.resolve(SOURCE_PATH, 'index-drop-builder.js');
    handlerBuilder = require(handlerBuilderPath);
    handlers = [];
    handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR)) Log.error(`Drop index handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.delete(dropPath, handlers);

    handlerBuilderPath = path.resolve(SOURCE_PATH, 'index-create-mapping-builder.js');
    handlerBuilder = require(handlerBuilderPath);
    handlers = [];
    handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR)) Log.error(`Create index mapping handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.post(createMappingPath, handlers);
  }

  static buildElasticsearchIndexAPIPaths(name) {
    const paths = [];
    if (!name) return paths;
    const urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    paths.push(`/${urlName}/index/:index/exists`); // exists (GET)
    paths.push(`/${urlName}/index`); // create (POST)
    paths.push(`/${urlName}/index/:index`); // drop (DELETE)
    paths.push(`/${urlName}/index/mapping`); // create mapping (POST)
    return paths;
  }

  buildElasticsearchDataAPI(router, config, databaseConnectionInfo) {
    const paths = RouteBuilderElasticsearchDatabase.buildElasticsearchDataAPIPaths(databaseConnectionInfo.name);
    const insertPath = paths[0];
    const updatePath = paths[1];
    const deletePath = paths[2];
    const queryPath = paths[3];
    let handlerBuilderPath = path.resolve(SOURCE_PATH, 'data-insert-builder.js');
    let handlerBuilder = require(handlerBuilderPath);
    let handlers = [];
    const authentication = this.authentication(config.authenticationStrategies, databaseConnectionInfo.authentication);
    const authorization = this.authorization(config.authenticationStrategies, databaseConnectionInfo.authorization);
    const loggingBegin = this.loggingBegin(databaseConnectionInfo);
    const loggingEnd = this.loggingEnd(databaseConnectionInfo);
    let handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR)) Log.error(`Data insert handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.post(insertPath, handlers);

    handlerBuilderPath = path.resolve(SOURCE_PATH, 'data-update-builder.js');
    handlerBuilder = require(handlerBuilderPath);
    handlers = [];
    handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR)) Log.error(`Data update handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.post(updatePath, handlers);

    handlerBuilderPath = path.resolve(SOURCE_PATH, 'data-delete-builder.js');
    handlerBuilder = require(handlerBuilderPath);
    handlers = [];
    handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR)) Log.error(`Data delete handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.delete(deletePath, handlers);

    handlerBuilderPath = path.resolve(SOURCE_PATH, 'data-query-builder.js');
    handlerBuilder = require(handlerBuilderPath);
    handlers = [];
    handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR)) Log.error(`Data query handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.get(queryPath, handlers);
  }

  static buildElasticsearchDataAPIPaths(name) {
    const paths = [];
    if (!name) return paths;
    const urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    paths.push(`/${urlName}/data`); // insert (POST)
    paths.push(`/${urlName}/data/update`); // update (POST)
    paths.push(`/${urlName}/data/:index/:type/:id`); // delete (DELETE)
    paths.push(`/${urlName}/data/:index/:type/:id`); // query (GET)
    return paths;
  }
}

module.exports = RouteBuilderElasticsearchDatabase;
