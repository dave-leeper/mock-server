//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    Router = require('../../../src/routers/route-builder.js'),
    Server = require('../../../server.js'),
    MockRequest = require('../../mock-request.js'),
    MockResponse = require('../../mock-response.js'),
    request = require('request');
let config = {
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
            "serviceFile": "throw.js"
        }
    ]
};

describe( 'As a developer, I need the server to continue running when exceptions are thrown.', function()
{
    it ( 'should continue running after an exception is thrown', ( done ) => {
        let port = 1337;
        let server = new Server();
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/throw", { json: true }, (err, res, body) => {
                request('http://localhost:' + port + "/ping", { json: true }, (err, res, body) => {
                    expect(body.name).to.be.equal("My Server");
                    expect(body.version).to.be.equal("1.0");
                    server.stop(() => {done(); });
                });
            });
        };
        server.init( port, config, serverInitCallback );
     });
});
