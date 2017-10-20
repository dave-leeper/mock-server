'use strict'

/**
 * @constructor
 */
function ThrowService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param router - The router.
 * @param serviceInfo - Service config info.
 */
ThrowService.prototype.do = function ( req, res, router, serviceInfo )
{
    throw "ERROR";
};

module.exports = ThrowService;
