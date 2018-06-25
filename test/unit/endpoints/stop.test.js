//@formatter:off
'use strict';
let chai = require( 'chai' ),
    expect = chai.expect;
let Stop = require('../../../src/endpoints/stop.js');
let MockRequest = require('../../mocks/mock-request' );
let MockResponse = require('../../mocks/mock-response' );
let Registry = require('../../../src/util/registry' );
let Log = require('../../../src/util/log' );

describe( 'As a developer, I need need to stop the server with an API call', function() {
    before(() => {
    });
    beforeEach(() => {
        Registry.unregisterAll();
    });
    afterEach(() => {
    });
    after(() => {
    });
    it ( 'should fail gracefully when there is no server in the registry', ( ) => {
        let configInfo = {};
        let stop = new Stop(configInfo);
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let next = () => {};
        stop.do(mockRequest, mockResponse, next)
        expect( mockResponse.sendStatus ).to.be.equal( 500 );
        expect( mockResponse.sendString ).to.be.equal( JSON.stringify({status: 'Error stopping server.'}) );
    });
    it ( 'should stop the server', ( ) => {
        let configInfo = {};
        let stop = new Stop(configInfo);
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let called = false;
        let next = () => {};
        Registry.register({ stop: ( ) => { called = true; }}, 'Server');
        stop.do(mockRequest, mockResponse, next)
        expect( mockResponse.sendStatus ).to.be.equal( 200 );
        expect( mockResponse.sendString ).to.be.equal( JSON.stringify({status: 'Stopping server...'}) );
        expect( called ).to.be.equal( true );
    });
});


