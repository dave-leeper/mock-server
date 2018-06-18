'use strict';

/**
 * @constructor
 */
function MockRequest ( path )
{
    this.path = path;
    this.params = {};
    this.query = {};
    this.files = {fileUploaded:{data: JSON.stringify({ name: 'name' })}};;
}

module.exports = MockRequest;
