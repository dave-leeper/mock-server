//@formatter:off
'use strict';
let chai = require( 'chai' ),
    expect = chai.expect;
let LocalStrategy = require('../../../src/authentication/local-strategy.js');
let MockRequest = require('../../mocks/mock-request' );
let MockResponse = require('../../mocks/mock-response' );
let Registry = require('../../../src/util/registry' );
let Strings = require('../../../src/util/strings' );
let I18n = require('../../../src/util/i18n' );
let Log = require('../../../src/util/log' );

describe( 'As a developer, I need need to define a custom authentication/authorization strategy', function() {
    before(() => {
    });
    beforeEach(() => {
        Registry.unregisterAll();
    });
    afterEach(() => {
    });
    after(() => {
    });
    it ( 'should fail gracefully when there is no server config in the registry', ( ) => {
        let operation = 'getAuthorization';
        const err = Log.stringify({ operation: operation, statusType: 'error', status: 501, message: I18n.get( Strings.AUTHORIZATION_NOT_CONFIGURED )});
        let localStrategy = new LocalStrategy();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let called = false;
        let next = () => { called = true; };
        let handler = localStrategy.getAuthorization();
        mockRequest.url = '/path';
        handler(mockRequest, mockResponse, next);
        expect( mockResponse.sendStatus ).to.be.equal( 501 );
        expect( mockResponse.sendString ).to.be.equal( err );
        expect( called ).to.be.equal( false );
    });
    it ( 'should fail gracefully when there is no request or no request path', ( ) => {
        Registry.register( { stuff: 'stuff' }, 'ServerConfig' );
        let operation = 'getAuthorization';
        const err = Log.stringify({ operation: operation, statusType: 'error', status: 501, message: I18n.get( Strings.AUTHORIZATION_NOT_CONFIGURED )});
        let localStrategy = new LocalStrategy();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let called = false;
        let next = () => { called = true; };
        let handler = localStrategy.getAuthorization();
        handler(mockRequest, mockResponse, next);
        expect( mockResponse.sendStatus ).to.be.equal( 501 );
        expect( mockResponse.sendString ).to.be.equal( err );
        expect( called ).to.be.equal( false );
        handler(null, mockResponse, next);
        expect( mockResponse.sendStatus ).to.be.equal( 501 );
        expect( mockResponse.sendString ).to.be.equal( err );
        expect( called ).to.be.equal( false );
    });
    it ( 'should fail gracefully when there is no request username', ( ) => {
        Registry.register( { stuff: 'stuff' }, 'ServerConfig' );
        let operation = 'getAuthorization';
        const err = Log.stringify({ operation: operation, statusType: 'error', status: 401, message: I18n.get( Strings.LOGIN_REQUIRED )});
        let localStrategy = new LocalStrategy();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let called = false;
        let next = () => { called = true; };
        let handler = localStrategy.getAuthorization();
        mockRequest.url = '/path';
        handler(mockRequest, mockResponse, next);
        expect( mockResponse.sendStatus ).to.be.equal( 401 );
        expect( mockResponse.sendString ).to.be.equal( err );
        expect( called ).to.be.equal( false );
        mockRequest.user = {};
        handler(mockRequest, mockResponse, next);
        expect( mockResponse.sendStatus ).to.be.equal( 401 );
        expect( mockResponse.sendString ).to.be.equal( err );
        expect( called ).to.be.equal( false );
    });
    it ( 'should fail gracefully when the request username has no account', ( ) => {
        Registry.register( { stuff: 'stuff' }, 'ServerConfig' );
        let operation = 'getAuthorization';
        const err = Log.stringify({ operation: operation, statusType: 'error', status: 401, message: I18n.format( I18n.get( Strings.INCORRECT_USER_NAME ), 'JUNK' )});
        let localStrategy = new LocalStrategy();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let called = false;
        let next = () => { called = true; };
        let handler = localStrategy.getAuthorization();
        mockRequest.url = '/path';
        mockRequest.user = { username: 'JUNK' };
        handler(mockRequest, mockResponse, next);
        expect( mockResponse.sendStatus ).to.be.equal( 401 );
        expect( mockResponse.sendString ).to.be.equal( err );
        expect( called ).to.be.equal( false );
    });
    it ( 'should succeed when there is config authorization info for a path', ( ) => {
        Registry.register( { stuff: 'stuff' }, 'ServerConfig' );
        let localStrategy = new LocalStrategy();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let called = false;
        let next = () => { called = true; };
        let handler = localStrategy.getAuthorization();
        mockRequest.url = '/path';
        mockRequest.user = { username: 'admin' };
        mockRequest.header('Request Method', 'GET');
        handler(mockRequest, mockResponse, next);
        expect( called ).to.be.equal( true );
    });
    it ( 'should fail gracefully when the request username has no permissions', ( ) => {
        let config = {
            authentication: [
                {
                    name: "local",
                    strategyFile: "local-strategy.js",
                    config: { "successRedirect": "/ping", "failureRedirect": "/login"}
                }
            ],
            microservices: [
                {
                    path: "/path",
                    name: "A microservice",
                    description: "A microservice used for testing",
                    serviceFile: "mocks.js",
                    authorization: { strategy: "local", groups: [ "admin" ] }
                },
            ]
        };
        Registry.register( config, 'ServerConfig' );
        let operation = 'getAuthorization';
        const err = Log.stringify({ operation: operation, statusType: 'error', status: 403, message: I18n.get( Strings.UNAUTHORIZED )});
        let localStrategy = new LocalStrategy();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let called = false;
        let next = () => { called = true; };
        let handler = localStrategy.getAuthorization();
        mockRequest.url = '/path';
        mockRequest.user = { username: 'username' };
        mockRequest.header('Request Method', 'GET');
        handler(mockRequest, mockResponse, next);
        expect( mockResponse.sendStatus ).to.be.equal( 403 );
        expect( mockResponse.sendString ).to.be.equal( err );
        expect( called ).to.be.equal( false );
    });
    it ( 'should succeed when the request username has permissions', ( ) => {
        let config = {
            authentication: [
                {
                    name: "local",
                    strategyFile: "local-strategy.js",
                    config: { "successRedirect": "/ping", "failureRedirect": "/login"}
                }
            ],
            microservices: [
                {
                    path: "/path",
                    name: "A microservice",
                    description: "A microservice used for testing",
                    serviceFile: "mocks.js",
                    authorization: { strategy: "local", groups: [ "admin" ] }
                },
            ]
        };
        Registry.register( config, 'ServerConfig' );
        let localStrategy = new LocalStrategy();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let called = false;
        let next = () => { called = true; };
        let handler = localStrategy.getAuthorization();
        mockRequest.url = '/path';
        mockRequest.user = { username: 'admin' };
        mockRequest.header('Request Method', 'GET');
        handler(mockRequest, mockResponse, next);
        expect( called ).to.be.equal( true );
    });
});


