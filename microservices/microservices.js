'use strict'

/**
 * @constructor
 */
function MicroservicesService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param router - The router.
 * @param serviceInfo - Service config info.
 */
MicroservicesService.prototype.do = function ( req, res, router, serviceInfo )
{
    return new Promise (( inResolve ) => {
        if ((router)
        && (router.server)
        && (router.server.serverConfig)
        && (router.server.serverConfig.microservices)
        && (router.server.serverConfig.microservices.length)) {
            let result = [];
            let microservices = router.server.serverConfig.microservices;

            for (let loop = 0; loop < microservices.length; loop++) {
                let service = microservices[loop];

                result.push({
                    "path": service.path,
                    "name": service.name,
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
