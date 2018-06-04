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
 * @param serviceInfo - Service configure info.
 */
ThrowService.prototype.do = function ( req, res, next, serviceInfo )
{
    throw Error("ERROR");
};

module.exports = ThrowService;
