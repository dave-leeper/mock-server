//@formatter:off
'use strict';

var chai = require( 'chai' ),
    expect = chai.expect,
    Server = require('../server.js'),
    request = require('request');
var config = {
    "mocks": [
        {
            "path": "/json",
            "response": "./test/test-data.json",
            "responseType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/hbs",
            "response": "index.hbs",
            "responseType": "HBS",
            "hbsData": {"title": "Index"},
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/text",
            "response": "./views/index.hbs",
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/json-junk",
            "response": "./JUNK.json",
            "responseType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/text-junk",
            "response": "./JUNK.tex",
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        }
    ],
    "microservices": [
        {
            "path": "/microservices",
            "name": "Services List",
            "description": "Provides a list of microservices registered with this server.",
            "serviceFile": "./microservices/microservices.js"
        },
        {
            "path": "/mocks",
            "name": "Mock Services List",
            "description": "Provides a list of mock microservices registered with this server.",
            "serviceFile": "./microservices/mocks.js"
        }
    ],
    "databaseConnections" : [
        {
            "name": "elasticsearch",
            "description": "Elasticsearch service.",
            "databaseConnector": "elasticsearch.js",
            "config": {
                "host": "localhost:9200",
                "log": "trace"
            }
        }
    ]
};

describe( 'As a developer, I need a server that sets up mock services, microservices, database connections, and can be started and stopped in memory.', function()
{
    it ( 'should be be able to start and stop from within javascript', ( done ) => {
        let port = '1337';
        let server = new Server();

        server.init(port, config, () => {
            server.stop(() => {
                expect(1).to.be.equal(1);
                done();
            });
        });

    });

    it ( 'should create an express object, a server object, and a databaseConnectorManager object and store the config.', ( done ) => {
        let port = '1337';
        let server = new Server();

        server.init(port, config, () => {
            server.stop(() => {
                expect(server.express).to.not.be.null;
                expect(server.server).to.not.be.null;
                expect(server.serverConfig).to.not.be.null;
                expect(server.databaseConnectorManager).to.not.be.null;
                expect(server.databaseConnectorManager.databaseConnectors.length).to.be.equal(1);
                done();
            });
        });
    });
});

describe( 'As a developer, I need need to run mock services.', function()
{
    it ( 'should write json files as a mock service', ( done ) => {
        let port = 1337;
        let server = new Server();
        let jsonResponse = '{"name":"My Server","version":"1.0"}';
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/json", { json: true }, (err, res, body) => {
                expect(JSON.stringify(body)).to.be.equal(jsonResponse);
                server.stop(() => { done(); });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should return not found if the json file for a mock service does not exist', ( done ) => {
        let port = 1337;
        let server = new Server();
        let jsonResponse = "\"<!DOCTYPE html>\\n<html>\\n  <head>\\n    <title></title>\\n    <link rel='stylesheet' href='/stylesheets/style.css' />\\n  </head>\\n  <body>\\n    <h1></h1>\\n<p>404 File Not Found</p>\\n\\n  </body>\\n</html>\\n\"";
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/json-junk", { json: true }, (err, res, body) => {
                expect(JSON.stringify(body)).to.be.equal(jsonResponse);
                server.stop(() => { done(); });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should write text files as a mock service', ( done ) => {
        let port = 1337;
        let server = new Server();
        let data = '"<h1>{{title}}</h1>\\n<p>Welcome to {{title}}</p>\\n"';
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/text", { json: true }, (err, res, body) => {
                expect(JSON.stringify(body)).to.be.equal(data);
                server.stop(() => { done(); });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should return not found if the text file for a mock service does not exist', ( done ) => {
        let port = 1337;
        let server = new Server();
        let jsonResponse = "\"<!DOCTYPE html>\\n<html>\\n  <head>\\n    <title></title>\\n    <link rel='stylesheet' href='/stylesheets/style.css' />\\n  </head>\\n  <body>\\n    <h1></h1>\\n<p>404 File Not Found</p>\\n\\n  </body>\\n</html>\\n\"";
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/text-junk", { json: true }, (err, res, body) => {
                expect(JSON.stringify(body)).to.be.equal(jsonResponse);
                server.stop(() => { done(); });
            });
        };
        server.init( port, config, serverInitCallback );
    });

});

