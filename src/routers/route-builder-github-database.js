/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const ServiceBase = require('../util/service-base.js');
const DatabaseConnectorManager = require('../database/database-connection-manager');
const Registry = require('../util/registry.js');
const Log = require('../util/log.js');

const SOURCE_PATH = './src/routers/data-route-builders/github/';

class RouteBuilderGithubDatabase extends ServiceBase {
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
      if (!databaseConnectionInfo.type || databaseConnectionInfo.type.toLowerCase() !== 'github') continue;
      if (databaseConnectionInfo.generateConnectionAPI) this.buildMongoConnectionAPI(router, config, databaseConnectionInfo);
      if (databaseConnectionInfo.generateCollectionAPI) this.buildMongoCollectionAPI(router, config, databaseConnectionInfo);
      if (databaseConnectionInfo.generateMDataAPI) this.buildMongoDataAPI(router, config, databaseConnectionInfo);
    }
    databaseConnectionCallback && databaseConnectionCallback(databaseConnectionPromises);
    return true;
  }

  buildGithubConnectionAPI(router, config, databaseConnectionInfo) {
    const paths = RouteBuilderGithubDatabase.buildGithubConnectionAPIPaths(databaseConnectionInfo.name);
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

  static buildMGithubConnectionAPIPaths(name) {
    const paths = [];
    if (!name) return paths;
    const urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    paths.push(`/${urlName}/connection/connect`); // connect (GET)
    paths.push(`/${urlName}/connection/ping`); // ping (GET)
    paths.push(`/${urlName}/connection/disconnect`); // disconnect (GET)
    return paths;
  }

  buildGithubCollectionAPI(router, config, databaseConnectionInfo) {
    const paths = RouteBuilderGithubDatabase.buildGithubCollectionAPIPaths(databaseConnectionInfo.name);
    const existsPath = paths[0];
    const createPath = paths[1];
    const dropPath = paths[2];
    let handlerBuilderPath = path.resolve(SOURCE_PATH, 'collection-exists-builder.js');
    let handlerBuilder = require(handlerBuilderPath);
    let handlers = [];
    const authentication = this.authentication(config.authenticationStrategies, databaseConnectionInfo.authentication);
    const authorization = this.authorization(config.authenticationStrategies, databaseConnectionInfo.authorization);
    const loggingBegin = this.loggingBegin(databaseConnectionInfo);
    const loggingEnd = this.loggingEnd(databaseConnectionInfo);
    let handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR)) Log.error(`Collection exists handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.get(existsPath, handlers);

    handlerBuilderPath = path.resolve(SOURCE_PATH, 'collection-create-builder.js');
    handlerBuilder = require(handlerBuilderPath);
    handlers = [];
    handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR)) Log.error(`Create collection handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.post(createPath, handlers);

    handlerBuilderPath = path.resolve(SOURCE_PATH, 'collection-drop-builder.js');
    handlerBuilder = require(handlerBuilderPath);
    handlers = [];
    handler = handlerBuilder(this, databaseConnectionInfo);
    if (!handler) {
      if (Log.will(Log.ERROR)) Log.error(`Drop collection handler not defined for database connection ${databaseConnectionInfo.name}.`);
      return;
    }
    if (loggingBegin) handlers.push(loggingBegin);
    if (authentication) handlers.push(authentication);
    if (authorization) handlers.push(authorization);
    handlers.push(handler);
    if (loggingEnd) handlers.push(loggingEnd);
    handlers.push((req, res) => {});
    router.delete(dropPath, handlers);
  }

  static buildGithubCollectionAPIPaths(name) {
    const paths = [];
    if (!name) return paths;
    const urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    paths.push(`/${urlName}/collection/:collection/exists`); // exists (GET)
    paths.push(`/${urlName}/collection/:collection`); // create (POST)
    paths.push(`/${urlName}/collection/:collection`); // drop (DELETE)
    return paths;
  }

  buildGithubDataAPI(router, config, databaseConnectionInfo) {
    const paths = RouteBuilderGithubDatabase.buildGithubDataAPIPaths(databaseConnectionInfo.name);
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
    router.put(updatePath, handlers);

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
  }

  static buildGithubDataAPIPaths(name) {
    const paths = [];
    if (!name) return paths;
    const urlName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    paths.push(`/${urlName}/data/:collection`); // insert (POST)
    paths.push(`/${urlName}/data/:collection`); // update (PUT)
    paths.push(`/${urlName}/data/:collection`); // delete (DELETE)
    return paths;
  }
}

module.exports = RouteBuilderGithubDatabase;
