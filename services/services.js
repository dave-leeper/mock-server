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
        if ((router) && (router.serverConfig) && (router.serverConfig.services) && (router.serverConfig.services.length)) {
            var result = [];

            for (var loop = 0; loop < router.serverConfig.services.length; loop++) {
                var service = router.serverConfig.services[loop];

                result.push({
                    "path": service.path,
                    "name": service.name,
                    "description": service.description
                });
            }
            res.send(JSON.stringify(result));
        } else {
            res.send(JSON.stringify({"response": "No registered services"}));
        }
        inResolve && inResolve ( null, this );
    });
};

module.exports = ServicesService;
