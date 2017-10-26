//@formatter:off
'use strict';

var chai = require( 'chai' ),
    expect = chai.expect,
    Router = require('../../router.js'),
    Server = require('../../server.js'),
    MockRequest = require('../mock-request.js'),
    MockResponse = require('../mock-response.js'),
    request = require('request');
var config = {
    "mocks": [
        {
            "path": "/ping",
            "response": {"name":"My Server","version":"1.0"},
            "responseType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        }
    ],
    "microservices": [
        {
            "path": "/throw",
            "name": "Throw Exception",
            "description": "A microservice that throws an exception. For testing purposes.",
            "serviceFile": "./microservices/throw.js"
        }
    ]
};

describe( 'As a developer, I need the server to continue running when exceptions are thrown.', function()
{
    it ( 'should continue running after an exception is thrown', ( done ) => {
        let port = 1337;
        let server = new Server();
        let pingResponse = '{"name":"My Server","version":"1.0"}';
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/throw", { json: true }, (err, res, body) => {
                request('http://localhost:' + port + "/ping", { json: true }, (err, res, body) => {
                    expect(JSON.stringify(body)).to.be.equal(pingResponse);
                    server.stop(() => {done(); });
                });
            });
        };
        server.init( port, config, serverInitCallback );
     });
});
