'use strict'

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
        if ((serviceInfo) && (serviceInfo.serviceData)) {
            res.send(JSON.stringify(serviceInfo.serviceData));
        } else {
            res.send(JSON.stringify({"response": "success"}));
        }
        inResolve && inResolve ( null, this );
    });
};

module.exports = PingService;
