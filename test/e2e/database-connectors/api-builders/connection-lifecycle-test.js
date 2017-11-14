//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    Server = require('../../../../server.js'),
    request = require('request');
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

describe( 'As a developer, I need an API for database connections', function( ) {
    it ( 'should build a handler for requests to connect/ping/disconnect to/from the database', ( done ) => {
        let port = 1337 ;
        let server = new Server();
        let connectPath = "/database/connection/elasticsearch/connect";
        let pingPath = "/database/connection/elasticsearch/ping";
        let disconnectPath = "/database/connection/elasticsearch/disconnect";
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
                            server.stop();
                            done();
                        });
                    });
                });
            });
        };

        server.init( port, config, callback );
    });
});


