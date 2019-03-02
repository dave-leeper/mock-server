//@formatter:off
'use strict';
let Log = require('../../../src/util/log' );
let Registry = require('../../../src/util/registry' );


let chai = require( 'chai' ),
    expect = chai.expect,
    DatabaseConnectionsMicroservice = require('../../../src/microservices/database-connections.js');
let config = {
    "databaseConnections" : [
        {
            "name": "elasticsearch",
            "description": "Elasticsearch service.",
            "databaseConnector": "elasticsearch.js",
            "generateElasticsearchConnectionAPI": true,
            "generateElasticsearchIndexAPI": true,
            "generateElasticsearchDataAPI": true,
            "config": {
                "host": "localhost:9200",
                "log": "trace"
            }
        }
    ]
};

describe( 'As a developer, I need need to obtain a list of database connections that are available.', function() {
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
    it ( 'should return a list of database connections available.', ( done) => {
        let databaseConnectionsMicroservice = new DatabaseConnectionsMicroservice();
        let expectedResponse = Log.stringify([{
            name: 'elasticsearch',
            description: 'Elasticsearch service.',
            path: [
                '/elasticsearch/connection/connect',
                '/elasticsearch/connection/ping',
                '/elasticsearch/connection/disconnect',
                '/elasticsearch/index/:index/exists',
                '/elasticsearch/index',
                '/elasticsearch/index/:index',
                '/elasticsearch/index/mapping',
                '/elasticsearch/data',
                '/elasticsearch/data/update',
                '/elasticsearch/data/:index/:type/:id',
                '/elasticsearch/data/:index/:type/:id'
            ]
        }]);
        Registry.register(config, 'ServerConfig');
        databaseConnectionsMicroservice.do({}).then((response) => {
            expect(response.send).to.be.equal(expectedResponse);
            expect(response.status).to.be.equal(200);
            done();
        }, ( error ) => {
            expect(true).to.be.equal(false);
        });
    });
});


