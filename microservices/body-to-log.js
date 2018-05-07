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
        if ( "ALL" === level ) logger.all(req.body);
        else if ( "TRACE" === level ) logger.trace(req.body);
        else if ( "DEBUG" === level ) logger.debug(req.body);
        else if ( "INFO" === level ) logger.info(req.body);
        else if ( "WARN" === level ) logger.warn(req.body);
        else if ( "ERROR" === level ) logger.error(req.body);
        else if ( "FATAL" === level ) logger.fatal(req.body);
        else {
            const error = { status: "error", operation: "Invalid logging level supplied in service information." };
            res.status(400);
            res.send(JSON.stringify(error));
            inReject && inReject(error, null);
            return;
        }
        const success = { status: "success", operation: "Print body to console" };
        res.status(200);
        res.send(JSON.stringify(success));
        inResolve && inResolve(null, success);
    });
};

module.exports = BodyToLogService;
