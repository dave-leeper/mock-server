'use strict'

/**
 * @constructor
 */
function MocksRespone ( )
{
    this.sentString = null;
    this.renderString = null;
    this.renderObject = null;
}

/**
 * @param send {String} - The string being sent.
 */
MocksRespone.prototype.send = function ( send )
{
    this.sentString = send;
};

/**
 * @param render {String} - The string being sent.
 * @param object {Object} - The object used for rendering.
 */
MocksRespone.prototype.render = function ( render, object )
{
    this.renderString = render;
    this.renderObject = object;
};

module.exports = MocksRespone;
