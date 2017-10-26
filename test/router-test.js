//@formatter:off
'use strict';

var chai = require( 'chai' ),
    expect = chai.expect,
    Router = require('../router.js'),
    mockExpressRouter = require('./mock-express-router.js'),
    mockRequest = require('./mock-request.js'),
    mockResponse = require('./mock-response.js'),
    utils = require('../util/file-utilities.js');
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
    ],
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

describe( 'As a developer, I need a router that handles all GET paths, understands the server config file, and invokes mocks and microservices.', function()
{
    it ( 'should handle a GET requests using the provided function and return the router parameter', ( ) => {
        let r = new mockExpressRouter();
        let returnValue = Router.connect(r);
        expect(returnValue).to.be.equal(r);
    });

    it ( 'should provide a default response of file not found', ( ) => {
        let resp = new mockResponse();
        Router.defaultResponse(resp);
        expect(resp.renderString).to.be.equal('not-found');
        expect(resp.renderObject).to.not.be.null;
        expect(resp.renderObject.title).to.not.be.null;
        expect(resp.renderObject.title).to.be.equal('File Not Found');
    });

    it ( 'should retreive the config record for a mock response', ( ) => {
        Router.server = {};
        Router.server.serverConfig = config;
        var mockResponseRecord = Router.getMockResponseInfo('/json');
        expect(mockResponseRecord).to.be.equal(config.mocks[0]);
        Router.server = null;
    });

    it ( 'should return null for invalid mock paths', ( ) => {
        Router.server = {};
        Router.server.serverConfig = config;
        var mockResponseRecord = Router.getMockResponseInfo('/JUNK');
        expect(mockResponseRecord).to.be.null;
        Router.server = null;
    });

    it ( 'should return null for the mock service when no config is set', ( ) => {
        Router.server = {};
        Router.server.serverConfig = null;
        var mockResponseRecord = Router.getMockResponseInfo('/json');
        expect(mockResponseRecord).to.be.null;
    });

    it ( 'should retreive the config record for a service response', ( ) => {
        Router.server = {};
        Router.server.serverConfig = config;
        var serviceResponseRecord = Router.getMicroserviceInfo('/ping');
        expect(serviceResponseRecord).to.be.equal(config.microservices[0]);
        Router.server = null;
    });

    it ( 'should return null for invalid service paths', ( ) => {
        Router.server = {};
        Router.server.serverConfig = config;
        var serviceResponseRecord = Router.getMicroserviceInfo('/JUNK');
        expect(serviceResponseRecord).to.be.null;
        Router.server = null;
    });

    it ( 'should return null for the service when no config is set', ( ) => {
        Router.server = {};
        Router.server.serverConfig = null;
        var serviceResponseRecord = Router.getMicroserviceInfo('/ping');
        expect(serviceResponseRecord).to.be.null;
    });

    it ( 'should add headers to mock microservices', ( ) => {
        Router.server = {};
        Router.server.serverConfig = config;
        let resp = new mockResponse();
        var mockResponseRecord = Router.getMockResponseInfo('/json');
        Router.addHeaders(mockResponseRecord, resp);
        expect(resp.headers).to.not.be.null;
        expect(resp.headers.length).to.equal(1);
        expect(resp.headers[0].name).to.equal("MY_HEADER");
        expect(resp.headers[0].value).to.equal("MY_HEADER_VALUE");
        Router.server = null;
    });

    it ( 'should add headers to microservices', ( ) => {
        Router.server = {};
        Router.server.serverConfig = config;
        let resp = new mockResponse();
        var serviceInfo = Router.getMicroserviceInfo('/ping');
        Router.addHeaders(serviceInfo, resp);
        expect(resp.headers).to.not.be.null;
        expect(resp.headers.length).to.equal(1);
        expect(resp.headers[0].name).to.equal("MY_HEADER");
        expect(resp.headers[0].value).to.equal("MY_HEADER_VALUE");
        Router.server = null;
    });

    // it ( 'should write json files as a mock service', ( ) => {
    //     Router.server = {};
    //     Router.server.serverConfig = config;
    //     let req = new mockRequest('/json');
    //     let resp = new mockResponse();
    //     let data = utils.readFileSync("./server-config.json");
    //     Router.route(req, resp);
    //     expect(resp.sendString).to.not.be.null;
    //     expect(resp.sendString).to.equal(data);
    //     Router.server = null;
    // });
    //
    // it ( 'should return not found if the json file for a mock service does not exist', ( ) => {
    //     Router.server = {};
    //     Router.server.serverConfig = config;
    //     let req = new mockRequest('/json-junk');
    //     let resp = new mockResponse();
    //     Router.route(req, resp);
    //     expect(resp.sendString).to.be.null;
    //     expect(resp.renderString).to.not.be.null;
    //     expect(resp.renderString).to.equal("not-found");
    //     Router.server = null;
    // });
    //
    // it ( 'should write text files as a mock service', ( ) => {
    //     Router.server = {};
    //     Router.server.serverConfig = config;
    //     let req = new mockRequest('/text');
    //     let resp = new mockResponse();
    //     let data = utils.readFileSync("./views/index.hbs");
    //     Router.route(req, resp);
    //     expect(resp.sendString).to.not.be.null;
    //     expect(resp.sendString).to.equal(data);
    //     Router.server = null;
    // });
    //
    // it ( 'should return not found if the text file for a mock service does not exist', ( ) => {
    //     Router.server = {};
    //     Router.server.serverConfig = config;
    //     let req = new mockRequest('/text-junk');
    //     let resp = new mockResponse();
    //     Router.route(req, resp);
    //     expect(resp.sendString).to.be.null;
    //     expect(resp.renderString).to.not.be.null;
    //     expect(resp.renderString).to.equal("not-found");
    //     Router.server = null;
    // });
});


