'use strict';

/**
 * @constructor
 */
function ThrowService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serviceInfo - Service config info.
 */
ThrowService.prototype.do = function ( req, res, serviceInfo )
{
    throw Error("ERROR");
};

module.exports = ThrowService;
