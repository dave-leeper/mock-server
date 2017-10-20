'use strict'

/**
 * @constructor
 */
function ServicesService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param router - The router.
 * @param serviceInfo - Service config info.
 */
ServicesService.prototype.do = function ( req, res, router, serviceInfo )
{
    return new Promise (( inResolve ) => {
        if ((router)
        && (router.server)
        && (router.server.serverConfig)
        && (router.server.serverConfig.services)
        && (router.server.serverConfig.services.length)) {
            let result = [];
            let services = router.server.serverConfig.services;

            for (let loop = 0; loop < services.length; loop++) {
                let service = services[loop];

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

module.exports = ServicesService;
