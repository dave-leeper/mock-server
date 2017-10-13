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
 * @param serverInfo - Server config info.
 * @param serviceInfo - Service config info.
 */
ServicesService.prototype.respond = function ( req, res, serverInfo, serviceInfo )
{
    return new Promise (( inResolve ) => {
        if ((serverInfo) && (serverInfo.services) && (serverInfo.services.length)) {
            var result = [];

            for (var loop = 0; loop < serverInfo.services.length; loop++) {
                var service = serverInfo.services[loop];

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
