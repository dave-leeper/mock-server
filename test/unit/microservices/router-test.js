//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    Router = require('../../../router.js'),
    mockExpressRouter = require('../../mock-express-router.js'),
    mockRequest = require('../../mock-request.js'),
    mockResponse = require('../../mock-response.js'),
    utils = require('../../../util/file-utilities.js');
let config = {
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
        },
        {
            "path": "/ping",
            "response": {"name":"My Server","version":"1.0"},
            "responseType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        }
    ],
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

describe( 'As a developer, I need a router that handles all GET paths, understands the server config file, and invokes mocks and microservices.', function()
{
    it ( 'should handle a GET requests using the provided function and return the router parameter', ( ) => {
        let r = new mockExpressRouter();
        let returnValue = Router.connect(r);
        expect(returnValue).to.be.equal(r);
    });

    it ( 'should provide a default response of file not found', ( ) => {
        let req = new mockRequest();
        let resp = new mockResponse();
        Router.defaultResponse(req, resp);
        expect(resp.renderString).to.be.equal('error');
        expect(resp.renderObject).to.not.be.null;
        expect(resp.renderObject.message).to.not.be.null;
        expect(resp.renderObject.message).to.be.equal('File Not Found.');
    });
});


