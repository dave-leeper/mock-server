'use strict'

var log = require ( '../util/logger-utilities.js' );

const   strModuleName = "PingService",
    strModuleEnter = ">" + strModuleName,
    strModuleExit = "<" + strModuleName,
    strModuleEnterRespond = strModuleEnter + ".respond",
    strModuleExitRespond = strModuleExit + ".respond";

/**
 * @constructor
 */
function PingService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serverInfo - Server config info.
 * @param serviceInfo - Service config info.
 */
PingService.prototype.respond = function ( req, res, serverInfo, serviceInfo )
{
    return new Promise (( inResolve ) => {
        if ( log.will( log.ALL )) log.all( strModuleEnterRespond );
        if ((serviceInfo) && (serviceInfo.serviceData)) {
            res.send(JSON.stringify(serviceInfo.serviceData));
        } else {
            res.send(JSON.stringify({"response": "success"}));
        }
        inResolve && inResolve ( null, this );
        if ( log.will( log.ALL )) log.all( strModuleExitRespond );
    });
};

module.exports = PingService;
