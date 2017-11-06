'use strict';

/**
 * @constructor
 */
function MicroservicesService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serviceInfo - Service config info.
 */
MicroservicesService.prototype.do = function ( req, res, serviceInfo )
{
    return new Promise (( inResolve ) => {
        if ((req)
        && (req.app)
        && (req.app.locals)
        && (req.app.locals.___extra)
        && (req.app.locals.___extra.serverConfig)
        && (req.app.locals.___extra.serverConfig.microservices)
        && (req.app.locals.___extra.serverConfig.microservices.length)) {
            let result = [];
            let microservices = req.app.locals.___extra.serverConfig.microservices;

            for (let loop = 0; loop < microservices.length; loop++) {
                let service = microservices[loop];

                result.push({
                    "name": service.name,
                    "path": service.path,
                    "description": service.description
                });
            }
            res.send(JSON.stringify(result));
        } else {
            res.send(JSON.stringify({"response": "No registered microservices"}));
        }
        inResolve && inResolve ( null, this );
    });
};

module.exports = MicroservicesService;
