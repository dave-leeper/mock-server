//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    MockRequest = require('../../../mock-request.js'),
    MockResponse = require('../../../mock-response.js'),
    MockRouteBuilderBase = require('../../../mock-route-builder-base.js'),
    ConnectionConnectBuilder = require('../../../../src/routers/data-route-builders/connection-connect-builder.js'),
    DatabaseConnectorManager = require('../../../../src/database/database-connection-manager.js');
let config = {
    "databaseConnections" : [
        {
            "name": "elasticsearch",
            "description": "Elasticsearch service.",
            "databaseConnector": "elasticsearch.js",
            "generateConnectionAPI": true,
            "config": {
                "host": "localhost:9200",
                "log": "trace"
            }
        }
    ]
};

describe( 'As a developer, I need an API for database connections', function() {
    it ( 'should build a handler for requests to connect to the database', ( ) => {
        let mockRouteBuilderBase = new MockRouteBuilderBase();
        let connectionConnectBuilder = ConnectionConnectBuilder(mockRouteBuilderBase, config.databaseConnections[0] );
        expect(connectionConnectBuilder).to.not.be.null;

        let req = new MockRequest();
        let res = new MockResponse();
        connectionConnectBuilder( req, res );
        expect(res.renderString).to.be.equal("error");
        expect(JSON.stringify(res.renderObject)).to.be.equal(JSON.stringify({message: "No database connection manager.", error: {status: 500}}));

        req.app.locals.___extra.databaseConnectionManager = new DatabaseConnectorManager();
        connectionConnectBuilder( req, res );
        expect(JSON.stringify(mockRouteBuilderBase.err)).to.be.equal(JSON.stringify({message: "No database connection.", error: {status: 500}}));
    });
});
