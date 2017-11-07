//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    Router = require('../../../router.js'),
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
            "path": "/stop",
            "name": "Server Stop",
            "description": "Shuts down the server.",
            "serviceFile": "./microservices/stop.js"
        }
    ]
};

describe( 'As a developer, I need the server to be able to shut down the server.', function()
{
    it ( 'should shut down', ( done ) => {
        let port = 1337;
        let server = new Server();
        let stopResponse = '{"response":"Server stopping."}';
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/stop", { json: true }, (err, res, body) => {
                expect(JSON.stringify(body)).to.be.equal(stopResponse);
                request('http://localhost:' + port + "/ping", { json: true }, (err, res, body) => {
                    expect(body).to.be.undefined;
                    done();
                });
            });
        };
        server.init( port, config, serverInitCallback );
    });
});
