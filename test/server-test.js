//@formatter:off
'use strict';

var chai = require( 'chai' ),
    expect = chai.expect,
    Server = require('../server.js');
var config = {
    "mocks": [
        {
            "path": "/json",
            "responseFile": "./server-config.json",
            "fileType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/hbs",
            "responseFile": "index.hbs",
            "fileType": "HBS",
            "hbsData": {"title": "Index"},
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/text",
            "responseFile": "./views/index.hbs",
            "fileType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/json-junk",
            "responseFile": "./JUNK.json",
            "fileType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/text-junk",
            "responseFile": "./JUNK.tex",
            "fileType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        }
    ],
    "microservices": [
        {
            "path": "/ping",
            "name": "Ping",
            "description": "A basic ping service.",
            "serviceFile": "./microservices/ping.js",
            "serviceData": { "name": "My Server", "version": "1.0" },
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
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


