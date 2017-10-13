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
        if ((serviceInfo) && (serviceInfo.serviceData)) {
            let pingData = serviceInfo.serviceData;

            pingData.serverStartTime = router.startTime;
            res.send(JSON.stringify(pingData));
        } else {
            res.send(JSON.stringify({"response": "success"}));
        }
        inResolve && inResolve ( null, this );
    });
};

module.exports = PingService;
