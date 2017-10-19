const express = require('express');
const http = require('http');
const router = express.Router();
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Router = require('./routes/router');

/**
 * @constructor
 */
function Server ( ) {
    this.express = null;
    this.server = null;
    this.serverConfig = null;
}

/**
 * Initialize the server.
 * @param port {Integer} The server port.
 * @param config {Object} The server config.
 */
Server.prototype.init = function ( port, config )
{
    this.express = express();

    // view engine setup
    this.express.set('views', path.join(__dirname, 'views'));
    this.express.set('view engine', 'hbs');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());
    this.express.use(express.static(path.join(__dirname, 'public')));

    // app.use('/', index);
    Router.startTime = new Date();
    Router.server = this;
    this.express.use('/', Router.connect(router));

    // catch 404 and forward to error handler
    this.express.use(function(req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    this.express.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    /**
     * Get port from environment and store in Express.
     */
    const normalizedPort = this.normalizePort(port);
    this.express.set('port', normalizedPort);

    this.server = http.createServer(this.express);
    this.server.listen(normalizedPort);
    this.server.on('error', this.onError);
    this.serverConfig = config;

    console.log('Listening on port ' + normalizedPort);
    return this;
};


/**
 * Normalize a port into a number, string, or false.
 * @param val {Object} The port number or pipe.
 */

Server.prototype.normalizePort = function (val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

/**
 * Event listener for HTTP server "error" event.
 * @param error {Object} The error.
 */

Server.prototype.onError = function (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

module.exports = Server;
