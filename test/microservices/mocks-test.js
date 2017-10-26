//@formatter:off
'use strict';

var chai = require( 'chai' ),
    expect = chai.expect,
    Router = require('../../router.js'),
    MocksMicroservice = require('../../microservices/mocks.js'),
    MockResponse = require('../mock-response.js');
var config = {
    "mocks": [
        {
            "path": "/json",
            "response": "./server-config.json",
            "responseType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/hbs",
            "response": "index.hbs",
            "responseType": "HBS",
            "hbsData": {"title": "Index"},
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/text",
            "response": "./views/index.hbs",
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/json-junk",
            "response": "./JUNK.json",
            "responseType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/text-junk",
            "response": "./JUNK.tex",
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        }
    ]
};

describe( 'As a developer, I need need to obtain a list of mock services that are available.', function()
{

    it ( 'should return a list of mock services available.', ( ) => {
        let mocksMicroservice = new MocksMicroservice();
        let mockResponse = new MockResponse();
        let mockRequest = {};
        let mockServiceInfo = {};
        let expectedResponse = '[{"path":"/json","response":"./server-config.json","responseType":"JSON"},{"path":"/hbs","response":"index.hbs","responseType":"HBS"},{"path":"/text","response":"./views/index.hbs","responseType":"TEXT"},{"path":"/json-junk","response":"./JUNK.json","responseType":"JSON"},{"path":"/text-junk","response":"./JUNK.tex","responseType":"TEXT"}]';

        Router.server = {};
        Router.server.serverConfig = config;
        mocksMicroservice.do(mockRequest, mockResponse, Router, mockServiceInfo);
        expect(mockResponse.sendString).to.be.equal(expectedResponse);
    });
});


