'use strict';

const logger = require('../util/logger-utilities');

/**
 * @constructor
 */
function BodyToLogService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serviceInfo - Service config info.
 */
BodyToLogService.prototype.do = function (req, res, serviceInfo )
{
    return new Promise (( inResolve, inReject ) => {
        let level = "DEBUG";
        if (serviceInfo && serviceInfo.serviceData && serviceInfo.serviceData.level) {
            level = serviceInfo.serviceData.level.toUpperCase();
        }
        let logMessage = req.body;
        if (serviceInfo && serviceInfo.serviceData && serviceInfo.serviceData.json) {
            logMessage = JSON.stringify(logMessage);
        }
        if ( "ALL" === level ) logger.all(logMessage);
        else if ( "TRACE" === level ) logger.trace(logMessage);
        else if ( "DEBUG" === level ) logger.debug(logMessage);
        else if ( "INFO" === level ) logger.info(logMessage);
        else if ( "WARN" === level ) logger.warn(logMessage);
        else if ( "ERROR" === level ) logger.error(logMessage);
        else if ( "FATAL" === level ) logger.fatal(logMessage);
        else {
            const error = { status: "error", operation: "Invalid logging level supplied in service information." };
            res.status(400);
            res.send(JSON.stringify(error));
            inReject && inReject(error, null);
            return;
        }
        const success = { status: "success", operation: "Print body to log" };
        res.status(200);
        res.send(JSON.stringify(success));
        inResolve && inResolve(null, success);
    });
};

module.exports = BodyToLogService;
