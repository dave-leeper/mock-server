'use strict';

/**
 * @constructor
 */
function MockRequest ( path )
{
    this.path = path;
    this.app = {};
    this.app.locals = {};
    this.app.locals.___extra = {};
}

module.exports = MockRequest;
