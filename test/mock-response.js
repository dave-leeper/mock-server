'use strict';

/**
 * @constructor
 */
function MockResponse ( )
{
    this.sendString = null;
    this.renderString = null;
    this.renderObject = null;
    this.sendStatus = 0;
    this.headers = [];
}

/**
 * @param send {String} - The string being sent.
 */
MockResponse.prototype.send = function ( send )
{
    this.sendString = send;
};

/**
 * @param render {String} - The string being sent.
 * @param object {Object} - The object used for rendering.
 */
MockResponse.prototype.render = function ( render, object )
{
    this.renderString = render;
    this.renderObject = object;
};

/**
 * @param name {String} - The header name.
 * @param value {String} - The header value.
 */
MockResponse.prototype.header = function ( name, value )
{
    this.headers.push({name: name, value: value});
};

/**
 * @param status {Integer} - The status.
 */
MockResponse.prototype.status = function ( status )
{
    this.sendStatus = status;
};

module.exports = MockResponse;
