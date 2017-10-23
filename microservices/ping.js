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
 * @param router - The router.
 * @param serviceInfo - Service config info.
 */
PingService.prototype.do = function ( req, res, router, serviceInfo )
{
    return new Promise (( inResolve ) => {
        if ((!serviceInfo) || (!serviceInfo.serviceData)) {
            res.send(JSON.stringify({ "response": "Server running." }));
            inResolve && inResolve ( null, this );
            return;
        }

        res.send(JSON.stringify(serviceInfo.serviceData));
        inResolve && inResolve ( null, this );
    });
};

module.exports = PingService;
