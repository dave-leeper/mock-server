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
    return new Promise (( inResolve, inReject ) => {
        if ((!req.app) || (!req.app.locals) || (!req.app.locals.___extra) || (!req.app.locals.___extra.server)) {
            const error = { "response": "Server not found." };
            res.status(500);
            res.send(JSON.stringify(error));
            inResolve && inResolve ( null, error );
            return;
        }

        const success = { "response": "Server stopping." };
        res.status(200);
        res.send(JSON.stringify(success));
        req.app.locals.___extra.server.stop( () => { inResolve && inResolve ( null, success ) } );
    });
};

module.exports = StopService;
