//@formatter:off
'use strict';
let Log = require('../../../src/util/log' );


let chai = require( 'chai' ),
    expect = chai.expect,
    DatabaseConnectionsMicroservice = require('../../../src/new-microservices/database-connections.js');
let config = {
    "databaseConnections" : [
        {
            "name": "elasticsearch",
            "description": "Elasticsearch service.",
            "databaseConnector": "elasticsearch.js",
            "generateConnectionAPI": true,
            "generateIndexAPI": true,
            "config": {
                "host": "localhost:9200",
                "log": "trace"
            }
        }
    ]
};

describe( 'As a developer, I need need to obtain a list of database connections that are available.', function() {
    it ( 'should return a list of database connections available.', ( done) => {
        let databaseConnectionsMicroservice = new DatabaseConnectionsMicroservice();
        let expectedResponse = Log.stringify([{
            name:"elasticsearch",
            description:"Elasticsearch service.",
            path:[
                "/elasticsearch/connection/connect",
                "/elasticsearch/connection/ping",
                "/elasticsearch/connection/disconnect"
            ]
        }]);
        let params = { serverConfig: config };
        databaseConnectionsMicroservice.do(params).then((response) => {
            expect(response.send).to.be.equal(expectedResponse);
            expect(response.status).to.be.equal(200);
            done();
        }, ( error ) => {
            expect(true).to.be.equal(false);
        });
    });
});


