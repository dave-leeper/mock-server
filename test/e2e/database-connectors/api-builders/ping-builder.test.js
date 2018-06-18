//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    MockRequest = require('../../../mock-request.js'),
    MockResponse = require('../../../mock-response.js'),
    MockRouteBuilderBase = require('../../../mock-route-builder-base.js'),
    ConnectionPingBuilder = require('../../../../src/routers/data-route-builders/connection-ping-builder.js'),
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

describe( 'As a developer, I need an API for database connections', function() {
    before(() => {
    });
    beforeEach(() => {
        Registry.unregisterAll();
    });
    afterEach(() => {
    });
    after(function() {
    });
    it ( 'should build a handler for requests to ping the database', ( ) => {
        let mockRouteBuilderBase = new MockRouteBuilderBase();
        let connectionHandler = ConnectionPingBuilder( mockRouteBuilderBase, config.databaseConnections[0] );
        expect(connectionHandler).to.not.be.null;

        let req = new MockRequest();
        let res = new MockResponse();
        connectionHandler( req, res );
        expect(JSON.stringify(mockRouteBuilderBase.err)).to.be.equal(JSON.stringify({message: "No database connection manager.", error: {status: 500}}));

        Registry.register(new DatabaseConnectorManager(), 'DatabaseConnectorManager')
        connectionHandler( req, res );
        expect(JSON.stringify(mockRouteBuilderBase.err)).to.be.equal(JSON.stringify({message: 'Error connecting to database. No connection found for elasticsearch.', error: {status: 500}}));
    });
});
