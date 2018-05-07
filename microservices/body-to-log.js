'use strict';

const path = require('path');

const FILE_PATH = path.join(__dirname , "/../files/");
/**
 * @constructor
 */
function BodyToConsoleService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serviceInfo - Service config info.
 */
BodyToConsoleService.prototype.do = function ( req, res, serviceInfo )
{
    return new Promise (( inResolve, inReject ) => {
        const success = { status: "success", operation: "Print body to console" };
        console.log(req.body);
        res.status(200);
        res.send(JSON.stringify(success));

        inResolve && inResolve(null, success);
    });
};

module.exports = BodyToConsoleService;
