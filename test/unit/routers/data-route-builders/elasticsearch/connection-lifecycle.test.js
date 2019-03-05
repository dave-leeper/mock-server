//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    Server = require('../../../../../server.js'),
    request = require('request'),
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

describe( 'As a developer, I need an API for database connections', function( ) {
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
    it ( 'should build a handler for requests to connect/ping/disconnect to/from the database', ( done ) => {
        let port = 1337 ;
        let server = new Server();
        let connectPath = "/elasticsearch/connection/connect";
        let pingPath = "/elasticsearch/connection/ping";
        let disconnectPath = "/elasticsearch/connection/disconnect";
        let connectBody = JSON.stringify({"databaseConnection":"elasticsearch","operation":"connect","isConnected":true});
        let ping1Body = JSON.stringify({"databaseConnection":"elasticsearch","operation":"ping","isConnected":true});
        let disconnectBody = JSON.stringify({"databaseConnection":"elasticsearch","operation":"disconnect","isConnected":false});
        let ping2Body = JSON.stringify({"databaseConnection":"elasticsearch","operation":"ping","isConnected":false});
        let callback = () => {
            request('http://localhost:' + port + connectPath, { json: true }, (err, res, body) => {
                expect(JSON.stringify(body)).to.be.equal(connectBody);
                request('http://localhost:' + port + pingPath, { json: true }, (err, res, body) => {
                    expect(JSON.stringify(body)).to.be.equal(ping1Body);
                    request('http://localhost:' + port + disconnectPath, { json: true }, (err, res, body) => {
                        expect(JSON.stringify(body)).to.be.equal(disconnectBody);
                        request('http://localhost:' + port + pingPath, { json: true }, (err, res, body) => {
                            expect(JSON.stringify(body)).to.be.equal(ping2Body);
                            server.stop(() => { done(); });
                        });
                    });
                });
            });
        };

        server.init( port, config, callback );
    });
});


