//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    MockRequest = require('../../../mock-request.js'),
    MockResponse = require('../../../mock-response.js'),
    MockRouteBuilderBase = require('../../../mock-route-builder-base.js'),
    ConnectionDisconnectBuilder = require('../../../../src/routers/data-route-builders/connection-disconnect-builder.js'),
    DatabaseConnectorManager = require('../../../../src/database/database-connection-manager.js'),
    Registry = require('../../../../src/util/registry.js');
let config = {
    "databaseConnections" : [
        {
            "name": "elasticsearch",
            "description": "Elasticsearch service.",
            "databaseConnector": "elasticsearch.js",
            "generateConnectionAPI": true,
            "generateIndexAPI": true,
            "generateDataAPI": true,
            "config": {
                "host": "localhost:9200",
                "log": "trace"
            },
            "cookies": [{ "name": "MY_COOKIE1", "value": "MY_COOKIE_VALUE1" }],
            "headers": [ { "header": "Access-Control-Allow-Origin", "value": "*" } ]
        }
    ]
};

describe( 'As a developer, I need an API for disconnecting database connections', function() {
    before(() => {
    });
    beforeEach(() => {
        Registry.unregisterAll();
    });
    afterEach(() => {
    });
    after(() => {
    });
    it ( 'should not build a handler using bad parameters', ( ) => {
        let mockRouteBuilderBase = new MockRouteBuilderBase();
        let connectionDisconnectBuilder = ConnectionDisconnectBuilder(mockRouteBuilderBase, null );
        expect(connectionDisconnectBuilder).to.be.undefined;
        connectionDisconnectBuilder = ConnectionDisconnectBuilder(null, config.databaseConnections[0] );
        expect(connectionDisconnectBuilder).to.be.undefined;
        connectionDisconnectBuilder = ConnectionDisconnectBuilder(null, null );
        expect(connectionDisconnectBuilder).to.be.undefined;
        connectionDisconnectBuilder = ConnectionDisconnectBuilder(mockRouteBuilderBase, {} );
        expect(connectionDisconnectBuilder).to.be.undefined;
        connectionDisconnectBuilder = ConnectionDisconnectBuilder({}, config.databaseConnections[0] );
        expect(connectionDisconnectBuilder).to.be.undefined;
        connectionDisconnectBuilder = ConnectionDisconnectBuilder({}, {} );
        expect(connectionDisconnectBuilder).to.be.undefined;
    });
    it ( 'should gracefully handle an invalid environment', ( ) => {
        Registry.unregisterAll();
        let mockRouteBuilderBase = new MockRouteBuilderBase();
        let connectionDisconnectBuilder = ConnectionDisconnectBuilder(mockRouteBuilderBase, config.databaseConnections[0] );
        let req = new MockRequest();
        let res = new MockResponse();
        connectionDisconnectBuilder( req, res );
        expect(mockRouteBuilderBase.err).to.not.be.null;
        expect(mockRouteBuilderBase.err.message).to.be.equal('No database connection manager.');
        expect(mockRouteBuilderBase.err.error).to.not.be.null;
        expect(mockRouteBuilderBase.err.error.status).to.be.equal(500);
        expect(mockRouteBuilderBase.headers).to.not.be.null;
        expect(Array.isArray(mockRouteBuilderBase.headers)).to.be.equal(true);
        expect(mockRouteBuilderBase.headers.length).to.be.equal(1);
        expect(mockRouteBuilderBase.headers[0]).to.not.be.null;
        expect(mockRouteBuilderBase.headers[0].header).to.be.equal('Access-Control-Allow-Origin');
        expect(mockRouteBuilderBase.headers[0].value).to.be.equal('*');
        expect(mockRouteBuilderBase.cookies).to.not.be.null;
        expect(Array.isArray(mockRouteBuilderBase.cookies)).to.be.equal(true);
        expect(mockRouteBuilderBase.cookies.length).to.be.equal(1);
        expect(mockRouteBuilderBase.cookies[0].name).to.be.equal('MY_COOKIE1');
        expect(mockRouteBuilderBase.cookies[0].value).to.be.equal('MY_COOKIE_VALUE1');
        mockRouteBuilderBase.reset();
        Registry.register(new DatabaseConnectorManager(), 'DatabaseConnectorManager');
        connectionDisconnectBuilder = ConnectionDisconnectBuilder(mockRouteBuilderBase, { name: 'JUNK' });
        connectionDisconnectBuilder( req, res );
        expect(mockRouteBuilderBase.err).to.not.be.null;
        expect(mockRouteBuilderBase.err.message).to.be.equal('Error connecting to database. No connection found for JUNK.');
        expect(mockRouteBuilderBase.err.error).to.not.be.null;
        expect(mockRouteBuilderBase.err.error.status).to.be.equal(404);
        expect(mockRouteBuilderBase.headers).to.not.be.null;
        expect(Array.isArray(mockRouteBuilderBase.headers)).to.be.equal(true);
        expect(mockRouteBuilderBase.headers.length).to.be.equal(0);
        expect(mockRouteBuilderBase.cookies).to.not.be.null;
        expect(Array.isArray(mockRouteBuilderBase.cookies)).to.be.equal(true);
        expect(mockRouteBuilderBase.cookies.length).to.be.equal(0);
    });
    it ( 'should be able to create a valid function', ( ) => {
        let databaseConnectorManager = new DatabaseConnectorManager();
        databaseConnectorManager.databaseConnectors.push({
            name: 'elasticsearch',
            disconnect: ()  => { return new Promise (( inResolve, inReject ) => { inResolve && inResolve( 1 );});}
        });
        Registry.register(databaseConnectorManager, 'DatabaseConnectorManager');
        let mockRouteBuilderBase = new MockRouteBuilderBase();
        let connectionDisconnectBuilder = ConnectionDisconnectBuilder(mockRouteBuilderBase, config.databaseConnections[0]);
        let req = new MockRequest();
        let res = new MockResponse();
        connectionDisconnectBuilder( req, res );
        expect(mockRouteBuilderBase.err).to.be.null;
        expect(mockRouteBuilderBase.headers).to.not.be.null;
        expect(Array.isArray(mockRouteBuilderBase.headers)).to.be.equal(true);
        expect(mockRouteBuilderBase.headers.length).to.be.equal(1);
        expect(mockRouteBuilderBase.headers[0]).to.not.be.null;
        expect(mockRouteBuilderBase.headers[0].header).to.be.equal('Access-Control-Allow-Origin');
        expect(mockRouteBuilderBase.headers[0].value).to.be.equal('*');
        expect(mockRouteBuilderBase.cookies).to.not.be.null;
        expect(Array.isArray(mockRouteBuilderBase.cookies)).to.be.equal(true);
        expect(mockRouteBuilderBase.cookies.length).to.be.equal(1);
        expect(mockRouteBuilderBase.cookies[0].name).to.be.equal('MY_COOKIE1');
        expect(mockRouteBuilderBase.cookies[0].value).to.be.equal('MY_COOKIE_VALUE1');
    });
});
