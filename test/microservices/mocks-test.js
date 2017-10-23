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
            "responseFile": "./server-config.json",
            "fileType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/hbs",
            "responseFile": "index.hbs",
            "fileType": "HBS",
            "hbsData": {"title": "Index"},
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/text",
            "responseFile": "./views/index.hbs",
            "fileType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/json-junk",
            "responseFile": "./JUNK.json",
            "fileType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/text-junk",
            "responseFile": "./JUNK.tex",
            "fileType": "TEXT",
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
        let expectedResponse = '[{"path":"/json","responseFile":"./server-config.json","fileType":"JSON"},{"path":"/hbs","responseFile":"index.hbs","fileType":"HBS"},{"path":"/text","responseFile":"./views/index.hbs","fileType":"TEXT"},{"path":"/json-junk","responseFile":"./JUNK.json","fileType":"JSON"},{"path":"/text-junk","responseFile":"./JUNK.tex","fileType":"TEXT"}]';

        Router.server = {};
        Router.server.serverConfig = config;
        mocksMicroservice.do(mockRequest, mockResponse, Router, mockServiceInfo);
        expect(mockResponse.sendString).to.be.equal(expectedResponse);
    });
});


