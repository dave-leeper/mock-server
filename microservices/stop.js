'use strict'

/**
 * @constructor
 */
function StopService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param router - The router.
 * @param serviceInfo - Service config info.
 */
StopService.prototype.do = function ( req, res, router, serviceInfo )
{
    return new Promise (( inResolve ) => {
        if ((!router) || (!router.server)) {
            res.send(JSON.stringify({ "response": "Server not found." }));
            inResolve && inResolve ( null, this );
            return;
        }

        router.server.stop( () => { inResolve && inResolve ( null, this ) } );
    });
};

module.exports = StopService;
