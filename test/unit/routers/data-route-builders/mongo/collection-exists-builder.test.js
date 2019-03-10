//@formatter:off
'use strict';

let chai = require( 'chai' );
let expect = chai.expect;
let MockRequest = require('../../../../mocks/mock-request.js');
let MockResponse = require('../../../../mocks/mock-response.js');
let MockRouteBuilderBase = require('../../../../mocks/mock-route-builder-base.js');
let CollectionExistsBuilder = require('../../../../../src/routers/data-route-builders/mongo/collection-exists-builder.js');
let DatabaseConnectorManager = require('../../../../../src/database/database-connection-manager.js');
let Registry = require('../../../../../src/util/registry.js');
let config = {
    "databaseConnections" : [
        {
            "name": "mongo",
            "type": "mongo",
            "description": "Mongo service.",
            "databaseConnector": "mongodb.js",
            "generateMongoConnectionAPI": true,
            "generateMongoCollectionAPI": true,
            "generateMongoDataAPI": true,
            "config": {
                "url": 'mongodb://localhost:27017',
                "db": 'testdb',
                "collections": {
                    "testCollection": { w: 0 }
                }
            },
            "cookies": [{ "name": "MY_COOKIE1", "value": "MY_COOKIE_VALUE1" }],
            "headers": [ { "header": "Access-Control-Allow-Origin", "value": "*" } ]
        }
    ]
};

describe( 'As a developer, I need an API to check if an Mongo database collection exists', function() {
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
        let indexExistsBuilder = CollectionExistsBuilder(mockRouteBuilderBase, null );
        expect(indexExistsBuilder).to.be.undefined;
        indexExistsBuilder = CollectionExistsBuilder(null, config.databaseConnections[0] );
        expect(indexExistsBuilder).to.be.undefined;
        indexExistsBuilder = CollectionExistsBuilder(null, null );
        expect(indexExistsBuilder).to.be.undefined;
        indexExistsBuilder = CollectionExistsBuilder(mockRouteBuilderBase, {} );
        expect(indexExistsBuilder).to.be.undefined;
        indexExistsBuilder = CollectionExistsBuilder({}, config.databaseConnections[0] );
        expect(indexExistsBuilder).to.be.undefined;
        indexExistsBuilder = CollectionExistsBuilder({}, {} );
        expect(indexExistsBuilder).to.be.undefined;
    });
    it ( 'should gracefully handle an invalid environment', ( ) => {
        Registry.unregisterAll();
        let mockRouteBuilderBase = new MockRouteBuilderBase();
        let indexExistsBuilder = CollectionExistsBuilder(mockRouteBuilderBase, config.databaseConnections[0] );
        let req = new MockRequest();
        let res = new MockResponse();
        indexExistsBuilder( req, res );
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
        indexExistsBuilder = CollectionExistsBuilder(mockRouteBuilderBase, { name: 'JUNK', type: 'JUNK' });
        indexExistsBuilder( req, res );
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
    it ( 'should gracefully handle invalid request parameters', ( ) => {
        let databaseConnectorManager = new DatabaseConnectorManager();
        databaseConnectorManager.databaseConnectors.push({
            name: 'mongo',
            collectionExists: ()  => { return new Promise (( inResolve, inReject ) => { inResolve && inResolve( 1 );});}
        });
        Registry.register(databaseConnectorManager, 'DatabaseConnectorManager');
        let mockRouteBuilderBase = new MockRouteBuilderBase();
        let indexExistsBuilder = CollectionExistsBuilder(mockRouteBuilderBase, config.databaseConnections[0]);
        let req = new MockRequest();
        let res = new MockResponse();
        indexExistsBuilder( req, res );
        expect(mockRouteBuilderBase.err).to.not.be.null;
        expect(mockRouteBuilderBase.err.message).to.be.equal('Error, no collection name provided.');
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
        req.params.collection = 'collection';
        indexExistsBuilder( req, res );
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
            name: 'mongo',
            collectionExists: ()  => { return new Promise (( inResolve, inReject ) => { inResolve && inResolve( 1 );});}
        });
        Registry.register(databaseConnectorManager, 'DatabaseConnectorManager');
        let mockRouteBuilderBase = new MockRouteBuilderBase();
        let collectionExistsBuilder = CollectionExistsBuilder(mockRouteBuilderBase, config.databaseConnections[0]);
        let req = new MockRequest();
        let res = new MockResponse();
        req.params.collection = 'collection';
        collectionExistsBuilder( req, res );
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
