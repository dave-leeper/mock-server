'use strict';

/**
 * @constructor
 */
function StopService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serviceInfo - Service config info.
 */
StopService.prototype.do = function ( req, res, serviceInfo )
{
    return new Promise (( inResolve ) => {
        if ((!req.app) || (!req.app.locals) || (!req.app.locals.___extra) || (!req.app.locals.___extra.server)) {
            res.send(JSON.stringify({ "response": "Server not found." }));
            inResolve && inResolve ( null, this );
            return;
        }

        res.send(JSON.stringify({ "response": "Server stopping." }));
        req.app.locals.___extra.server.stop( () => { inResolve && inResolve ( null, this ) } );
    });
};

module.exports = StopService;
