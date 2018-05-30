//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    Router = require('../../../router.js'),
    MicroservicesMicroservice = require('../../../microservices/microservices.js'),
    MockRequest = require('../../mock-request.js'),
    MockResponse = require('../../mock-response.js');
let config = {
    "microservices": [
        {
            "path": "/microservices",
            "name": "Services List",
            "description": "Provides a list of microservices registered with this server.",
            "serviceFile": "util.js"
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
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let mockServiceInfo = {};
        let expectedResponse = '[{"name":"Services List","path":"/microservices","description":"Provides a list of microservices registered with this server."},{"name":"Mock Services List","path":"/mocks","description":"Provides a list of mock microservices registered with this server."}]';

        mockRequest.app.locals.___extra.serverConfig = config;
        microservicesMicroservice.do(mockRequest, mockResponse, mockServiceInfo);
        expect(mockResponse.sendString).to.be.equal(expectedResponse);
        expect(mockResponse.sendStatus).to.be.equal(200);
    });
});


