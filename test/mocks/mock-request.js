'use strict';

/**
 * @constructor
 */
function MockRequest ( path ) {
    this.reset(path);
}
MockRequest.prototype.reset = function ( path ) {
    this.path = path;
    this.params = {};
    this.query = {};
    this.files = {filename:{data: JSON.stringify({ name: 'name' })}};;
};

module.exports = MockRequest;
