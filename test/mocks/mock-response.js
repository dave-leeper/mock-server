'use strict';

function MockResponse ( ) {
    this.reset();
}
MockResponse.prototype.reset = function ( ) {
    this.sendString = null;
    this.sendfile = null;
    this.renderString = null;
    this.renderObject = null;
    this.sendStatus = 0;
    this.headers = [];
    this.cookies = [];
};
MockResponse.prototype.send = function ( send ) {
    this.sendString = send;
};
MockResponse.prototype.sendFile = function ( send ) {
    this.sendfile = send;
};
MockResponse.prototype.render = function ( render, object ) {
    this.renderString = render;
    this.renderObject = object;
};
MockResponse.prototype.header = function ( name, value ) {
    this.headers.push({header: name, value: value});
};
MockResponse.prototype.cookie = function ( name, value ) {
    this.cookies.push({name: name, value: value});
};
MockResponse.prototype.status = function ( status ) {
    this.sendStatus = status;
};

module.exports = MockResponse;
