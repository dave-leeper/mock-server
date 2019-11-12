//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    MockRequest = require('../../../../mocks/mock-request.js'),
    MockResponse = require('../../../../mocks/mock-response.js'),
    MockRouteBuilderBase = require('../../../../mocks/mock-route-builder-base.js'),
    DataInsertBuilder = require('../../../../../src/routers/data-route-builders/elasticsearch/data-insert-builder.js'),
    DatabaseConnectorManager = require('../../../../../src/database/database-connection-manager.js'),
    Registry = require('../../../../../src/util/registry.js');
let config = {
    "databaseConnections" : [
        {
            "name": "elasticsearch",
            "type": "elasticsearch",
            "description": "Elasticsearch service.",
            "databaseConnector": "elasticsearch.js",
            "generateElasticsearchConnectionAPI": true,
            "generateElasticsearchIndexAPI": true,
            "generateElasticsearchDataAPI": true,
            "config": {
                "host": "localhost:9200",
                "log": "trace"
            },
            "cookies": [{ "name": "MY_COOKIE1", "value": "MY_COOKIE_VALUE1" }],
            "headers": [ { "header": "Access-Control-Allow-Origin", "value": "*" } ]
        }
    ]
};

describe( 'As a developer, I need an API to insert data into the database', function() {
    before(() => {
    });
    beforeEach(() => {
        Registry.unregisterAll();
    });
    afterEach(() => {
    });
    after(() => {
        Registry.unregisterAll();
    });
    it ( 'should not build a handler using bad parameters', ( ) => {
        let mockRouteBuilderBase = new MockRouteBuilderBase();
        let dataInsertBuilder = DataInsertBuilder(mockRouteBuilderBase, null );
        expect(dataInsertBuilder).to.be.undefined;
        dataInsertBuilder = DataInsertBuilder(null, config.databaseConnections[0] );
        expect(dataInsertBuilder).to.be.undefined;
        dataInsertBuilder = DataInsertBuilder(null, null );
        expect(dataInsertBuilder).to.be.undefined;
        dataInsertBuilder = DataInsertBuilder(mockRouteBuilderBase, {} );
        expect(dataInsertBuilder).to.be.undefined;
        dataInsertBuilder = DataInsertBuilder({}, config.databaseConnections[0] );
        expect(dataInsertBuilder).to.be.undefined;
        dataInsertBuilder = DataInsertBuilder({}, {} );
        expect(dataInsertBuilder).to.be.undefined;
    });
    it ( 'should gracefully handle an invalid environment', ( ) => {
        Registry.unregisterAll();
        let mockRouteBuilderBase = new MockRouteBuilderBase();
        let dataInsertBuilder = DataInsertBuilder(mockRouteBuilderBase, config.databaseConnections[0] );
        let req = new MockRequest();
        let res = new MockResponse();
        dataInsertBuilder( req, res );
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
        dataInsertBuilder = DataInsertBuilder(mockRouteBuilderBase, { name: 'JUNK', type: 'JUNK' });
        dataInsertBuilder( req, res );
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
    it ( 'should gracefully handle invalid upload files', ( ) => {
        let databaseConnectorManager = new DatabaseConnectorManager();
        databaseConnectorManager.databaseConnectors.push({
            name: 'elasticsearch',
            insert: ()  => { return new Promise (( inResolve, inReject ) => { inResolve && inResolve( 1 );});}
        });
        Registry.register(databaseConnectorManager, 'DatabaseConnectorManager');
        let mockRouteBuilderBase = new MockRouteBuilderBase();
        let dataInsertBuilder = DataInsertBuilder(mockRouteBuilderBase, config.databaseConnections[0]);
        let req = new MockRequest();
        let res = new MockResponse();
        req.files = null;
        dataInsertBuilder( req, res );
        expect(mockRouteBuilderBase.err).to.not.be.null;
        expect(mockRouteBuilderBase.err.message).to.be.equal('Error, no file was uploaded.');
        expect(mockRouteBuilderBase.err.error).to.not.be.null;
        expect(mockRouteBuilderBase.err.error.status).to.be.equal(400);
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
        req.files = {};
        dataInsertBuilder( req, res );
        expect(mockRouteBuilderBase.err).to.not.be.null;
        expect(mockRouteBuilderBase.err.message).to.be.equal('Error, no file was uploaded.');
        expect(mockRouteBuilderBase.err.error).to.not.be.null;
        expect(mockRouteBuilderBase.err.error.status).to.be.equal(400);
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
        req.files = {filename:{}};
        dataInsertBuilder( req, res );
        expect(mockRouteBuilderBase.err).to.not.be.null;
        expect(mockRouteBuilderBase.err.message).to.be.equal('Error, no file was uploaded.');
        expect(mockRouteBuilderBase.err.error).to.not.be.null;
        expect(mockRouteBuilderBase.err.error.status).to.be.equal(400);
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
        req.files = {filename:{data: JSON.stringify({ name: 'name' })}};
        dataInsertBuilder( req, res );
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
        mockRouteBuilderBase.reset();
    });
    it ( 'should be able to create a valid function', ( ) => {
        let databaseConnectorManager = new DatabaseConnectorManager();
        databaseConnectorManager.databaseConnectors.push({
            name: 'elasticsearch',
            insert: ()  => { return new Promise (( inResolve, inReject ) => { inResolve && inResolve( 1 );});}
        });
        Registry.register(databaseConnectorManager, 'DatabaseConnectorManager');
        let mockRouteBuilderBase = new MockRouteBuilderBase();
        let dataInsertBuilder = DataInsertBuilder(mockRouteBuilderBase, config.databaseConnections[0]);
        let req = new MockRequest();
        let res = new MockResponse();
        req.files = {filename:{data: JSON.stringify({ name: 'name' })}};
        dataInsertBuilder( req, res );
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
