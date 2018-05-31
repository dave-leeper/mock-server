//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    Router = require('../../../src/router.js'),
    mockExpressRouter = require('../../mock-express-router.js'),
    mockRequest = require('../../mock-request.js'),
    mockResponse = require('../../mock-response.js');

describe( 'As a developer, I need a router that handles all GET paths, understands the server config file, and invokes mocks and microservices.', function()  {
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


