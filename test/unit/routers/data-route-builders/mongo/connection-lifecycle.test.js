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

describe( 'As a developer, I need an API for Mongo database connections', function( ) {
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
    it ( 'should build a handler for requests to connect/ping/disconnect to/from the Mongo database', ( done ) => {
        let port = 1337 ;
        let server = new Server();
        let connectPath = "/mongo/connection/connect";
        let pingPath = "/mongo/connection/ping";
        let disconnectPath = "/mongo/connection/disconnect";
        let connectBody = JSON.stringify({"databaseConnection":"mongo","operation":"connect","isConnected":true});
        let ping1Body = JSON.stringify({"databaseConnection":"mongo","operation":"ping","isConnected":true});
        let disconnectBody = JSON.stringify({"databaseConnection":"mongo","operation":"disconnect","isConnected":false});
        let ping2Body = JSON.stringify({"databaseConnection":"mongo","operation":"ping","isConnected":false});
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


