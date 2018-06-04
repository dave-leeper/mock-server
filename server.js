'use strict';

const express = require('express');
const http = require('http');
const router = express.Router();
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy')
const fileUpload = require('express-fileupload');
const Router = require('./src/router');
const Log = require('./src/util/log');
const FileUtilities = require('./src/util/file-utilities.js');

/**
 * @constructor
 */
class Server {
    constructor() {
        this.express = null;
        this.server = null;
    }

    init(port, config, callback) {
        let locals = {
            port: port
        };
        let getConfigFileNames = (config) => {
            let configList = FileUtilities.getFileList(config, /.json/i, true, false);
            if (!configList) [];
            for (let loop = 0; loop < configList.length; loop++) {
                let fullPath = path.join(__dirname, path.join(config, configList[loop]));
                configList[loop] = fullPath;
            }
            return configList;
        };
        let loadConfigs = (configFileNames) => {
            let loadedConfigs = [];
            for (let loop = 0; loop < configFileNames.length; loop++) {
                loadedConfigs.push(require(configFileNames[loop]));
            }
            return loadedConfigs;
        };
        let mergeConfigs = (loadedConfigs) => {
            let mergedConfig = {};
            for (let loop = 0; loop < loadedConfigs.length; loop++) {
                let config = loadedConfigs[loop];
                // Only first logging configure is used
                if (config.logging && !mergedConfig.logging) mergedConfig.logging = config.logging;
                if (config.port) mergedConfig.port = config.port;
                if (config.mocks) {
                    if (!mergedConfig.mocks) mergedConfig.mocks = [];
                    mergedConfig.mocks = mergedConfig.mocks.concat(config.mocks);
                }
                if (config.microservices) {
                    if (!mergedConfig.microservices) mergedConfig.microservices = [];
                    mergedConfig.microservices = mergedConfig.microservices.concat(config.microservices);
                }
                if (config.databaseConnections) {
                    if (!mergedConfig.databaseConnections) mergedConfig.databaseConnections = [];
                    mergedConfig.databaseConnections = mergedConfig.databaseConnections.concat(config.databaseConnections);
                }
            }
            return mergedConfig;
        };
        let serverConfig = config;
        if ("string" === typeof config) serverConfig = mergeConfigs(loadConfigs(getConfigFileNames(config)));

        this.express = express();

        // Logger setup
        if (serverConfig.logging) Log.configure(serverConfig.logging);
        Log.trace(Log.stringify(serverConfig));

        // Override port
        if (serverConfig.port) locals.port = serverConfig.port;

        // view engine setup
        this.express.set('views', path.join(__dirname, 'src', 'views'));
        this.express.set('view engine', 'hbs');

        this.express.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
        this.express.use(cookieParser());
        this.express.use(express.static(path.join(__dirname, 'public')));
        this.express.use(busboy());
        this.express.use(fileUpload());

        // app.use('/', index);
        this.express.use('/', Router.connect(router, serverConfig));
        this.express.locals.___extra = {
            startTime: new Date(),
            server: this,
            serverConfig: serverConfig,
            stack: router.stack,
            databaseConnectionManager: Router.databaseConnectionManager
        };

        // catch 404 and forward to error handler
        this.express.use(function (req, res, next) {
            let err = new Error('Not Found: ' + req.url);
            err.status = 404;
            next(err);
        });

        // error handler
        this.express.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });

        const normalizedPort = this.normalizePort(locals.port);
        this.express.set('port', normalizedPort);

        this.server = http.createServer(this.express);
        this.server.listen(normalizedPort, callback);
        this.server.on('error', this.onError);


        console.log('Listening on port ' + normalizedPort);
        return this;
    }

    stop(callback) {
        try {
            if (this.express.locals.___extra.databaseConnectionManager) {
                this.express.locals.___extra.databaseConnectionManager.disconnect();
            }
        } catch (err) {
            console.log("Error shutting down database connections.");
        }
        this.server.close(callback);
    }

    /**
     * Normalize a port into a number, string, or false.
     * @param val {Object} The port number or pipe.
     */
    normalizePort(val) {
        const port = parseInt(val, 10);
        // named pipe
        if (isNaN(port)) return val;
        // port number
        if (port >= 0) return port;
        return false;
    }
    onError(error) {
        console.log(error);
    }
}

module.exports = Server;
