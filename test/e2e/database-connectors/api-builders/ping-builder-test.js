//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    Router = require('../../../../router.js'),
    mockRequest = require('../../../mock-request.js'),
    mockResponse = require('../../../mock-response.js'),
    pingHandlerBuilder = require('../../../../database-connectors/api-builders/ping-builder.js'),
    DatabaseConnectorManager = require('../../../../database-connectors/database-connector-manager.js');
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
    it ( 'should build a handler for requests to disconnect from the database', ( ) => {
        let connectionHandler = pingHandlerBuilder( Router, config.databaseConnections[0] );
        expect(connectionHandler).to.not.be.null;

        let req = new mockRequest();
        let res = new mockResponse();
        connectionHandler( req, res );
        expect(res.renderString).to.be.equal("error");
        expect(JSON.stringify(res.renderObject)).to.be.equal(JSON.stringify({message: "No database connection manager.", error: {status: 500}}));

        req.app.locals.___extra.databaseConnectionManager = new DatabaseConnectorManager();
        connectionHandler( req, res );
        expect(res.renderString).to.be.equal("error");
        expect(JSON.stringify(res.renderObject)).to.be.equal(JSON.stringify({message: "No database connection.", error: {status: 500}}));
    });
});
