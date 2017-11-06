'use strict';

/**
 * @constructor
 */
function MockExpressRouter ( )
{
    this.path = null;
    this.handler = null;
}

/**
 * @param path {String} - The GET path to be handled by the router.
 * @param handler {Function} - The function invoked when the GET path is referenced by the user.
 */
MockExpressRouter.prototype.get = function ( path, handler )
{
    this.path = path;
    this.handler = handler;
};

module.exports = MockExpressRouter;
