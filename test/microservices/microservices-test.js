//@formatter:off
'use strict';

var chai = require( 'chai' ),
    expect = chai.expect,
    Router = require('../../router.js'),
    MicroservicesMicroservice = require('../../microservices/microservices.js'),
    MockResponse = require('../mock-response.js');
var config = {
    "microservices": [
        {
            "path": "/ping",
            "name": "Ping",
            "description": "A basic ping service.",
            "serviceFile": "ping.js",
            "serviceData": { "name": "My Server", "version": "1.0" },
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/microservices",
            "name": "Services List",
            "description": "Provides a list of microservices registered with this server.",
            "serviceFile": "services.js"
        },
        {
            "path": "/mocks",
            "name": "Mock Services List",
            "description": "Provides a list of mock microservices registered with this server.",
            "serviceFile": "mocks.js"
        }
    ]
};

describe( 'As a developer, I need need to obtain a list of microservices that are available.', function()
{

    it ( 'should return a list of microservices available.', ( ) => {
        let microservicesMicroservice = new MicroservicesMicroservice();
        let mockResponse = new MockResponse();
        let mockRequest = {};
        let mockServiceInfo = {};
        let expectedResponse = '[{"path":"/ping","name":"Ping","description":"A basic ping service."},{"path":"/microservices","name":"Services List","description":"Provides a list of microservices registered with this server."},{"path":"/mocks","name":"Mock Services List","description":"Provides a list of mock microservices registered with this server."}]';

        Router.server = {};
        Router.server.serverConfig = config;
        microservicesMicroservice.do(mockRequest, mockResponse, Router, mockServiceInfo);
        expect(mockResponse.sendString).to.be.equal(expectedResponse);
    });
});


