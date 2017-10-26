//@formatter:off
'use strict';

var chai = require( 'chai' ),
    expect = chai.expect,
    Router = require('../../router.js'),
    PingMicroservice = require('../../microservices/ping.js'),
    MockResponse = require('../mock-response.js');
var config = {
    "mocks": [
        {
            "path": "/text-junk",
            "response": "./JUNK.tex",
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        }
    ]
};

describe( 'As a developer, I need need to be able to ping the server to see if its running.', function()
{

    it ( 'should return a notification that the server is running.', ( ) => {
        let pingMicroservice = new PingMicroservice();
        let mockResponse = new MockResponse();
        let mockRequest = {};
        let mockServiceInfo = {
            "path": "/ping",
            "name": "Ping",
            "description": "A basic ping service.",
            "serviceFile": "ping.js",
            "serviceData": { "name": "My Server", "version": "1.0" },
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        };
        let expectedResponse = '{"name":"My Server","version":"1.0"}';

        Router.serverConfig = config;
        pingMicroservice.do(mockRequest, mockResponse, Router, mockServiceInfo);
        expect(mockResponse.sendString).to.be.equal(expectedResponse);
        expectedResponse = '{"response":"Server running."}';
        pingMicroservice.do(mockRequest, mockResponse, Router, {});
        expect(mockResponse.sendString).to.be.equal(expectedResponse);
    });
});


