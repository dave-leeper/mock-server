'use strict';

const logger = require('../util/logger-utilities');

/**
 * @constructor
 */
function LogRequestService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serviceInfo - Servic  e config info.
 */
LogRequestService.prototype.do = function (req, res, next, serviceInfo )
{
    return new Promise (( inResolve, inReject ) => {
        // Calculate log level.
        let level = "DEBUG";
        if (serviceInfo && serviceInfo.serviceData && serviceInfo.serviceData.level) {
            level = serviceInfo.serviceData.level.toUpperCase();
        }

        // Log body.
        let body = req.body;
        if (serviceInfo && serviceInfo.serviceData && serviceInfo.serviceData.json) {
            body = JSON.stringify(body);
        }
        let logError = this.log(level, "BODY: " + body);
        if (logError) {
            res.status(404);
            res.render("error", logError);
            inReject && inReject ( logError );
            return;
        }

        // Log files
        let files = null;
        if ((req.files)
        && (req.files.fileUploaded)
        && (req.files.fileUploaded.data)) {
            files = req.files.fileUploaded.data;
            if (serviceInfo && serviceInfo.serviceData && serviceInfo.serviceData.json) {
                files = JSON.stringify(files);
            }
        }
        logError = this.log(level, "FILES: " + files);
        if (logError) {
            res.status(404);
            res.render("error", logError);
            inReject && inReject ( logError );
            return;
        }

        // Log headers
        logError = this.log(level, "HEADERS: " + JSON.stringify(req.headers));
        if (logError) {
            res.status(404);
            res.render("error", logError);
            inReject && inReject ( logError );
            return;
        }

        // Log Cookies
        logError = this.log(level, "COOKIES: " + JSON.stringify(req.cookies));
        if (logError) {
            res.status(404);
            res.render("error", logError);
            inReject && inReject ( logError );
            return;
        }

        const success = { status: "success", operation: "Print request to log" };
        res.status(200);
        res.send(JSON.stringify(success));
        next();
        inResolve && inResolve(success);
    });
};

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serviceInfo - Servic  e config info.
 */
LogRequestService.prototype.log = function (level, logMessage ) {
    if ( "ALL" === level ) logger.all(logMessage);
    else if ( "TRACE" === level ) logger.trace(logMessage);
    else if ( "DEBUG" === level ) logger.debug(logMessage);
    else if ( "INFO" === level ) logger.info(logMessage);
    else if ( "WARN" === level ) logger.warn(logMessage);
    else if ( "ERROR" === level ) logger.error(logMessage);
    else if ( "FATAL" === level ) logger.fatal(logMessage);
    else {
        return {
            status: "error",
            operation: "Log request",
            error: "Invalid logging level supplied in service information. " +
                "Must be TRACE, DEBUG, INFO, WARN, ERROR, or FATAL. " +
                "Received " + level + "."
        };
    }
    return null;
};

module.exports = LogRequestService;
