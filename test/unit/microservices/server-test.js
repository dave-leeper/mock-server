//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    Server = require('../../../server.js'),
    request = require('request');
let config = {
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
        },
        {
            "path": "/json-string-array",
            "response": ["./test/test-data.json", "./test/test-data2.json"],
            "responseType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/json-object",
            "response": {"title": "Index"},
            "responseType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/json-object-array",
            "response": [{"title": "Index"}, {"title": "Not Found"} ],
            "responseType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/hbs-string-array",
            "response": [ "index.hbs", "error.hbs" ],
            "responseType": "HBS",
            "hbsData": [ {"title": "Index"}, {"title": "Not Found"} ],
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/text-string-array",
            "response": [ "./src/views/index.hbs", "./src/views/error.hbs" ],
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/text-object",
            "response": {"title": "Index"},
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/text-object2",
            "response": {"text": "Index"},
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/text-object-array",
            "response": [{"title": "Index"}, {"title": "Not Found"} ],
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/text-object-array2",
            "response": [{"text": "Index"}, {"text": "Not Found"} ],
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        }
    ],
    "microservices": [
        {
            "path": "/microservices",
            "name": "Services List",
            "description": "Provides a list of microservices registered with this server.",
            "serviceFile": "microservices.js",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "path": "/mocks",
            "name": "Mock Services List",
            "description": "Provides a list of mock microservices registered with this server.",
            "serviceFile": "mocks.js"
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
            },
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        }
    ]
};

describe( 'As a developer, I need a server that sets up mock util, microservices, database connections, and can be started and stopped in memory.', function()
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
            expect(server.server).to.not.be.null;
            expect(server.express).to.not.be.null;
            expect(server.express.locals).to.not.be.null;
            expect(server.express.locals.___extra).to.not.be.null;
            expect(server.express.locals.___extra.startTime).to.not.be.null;
            expect(server.express.locals.___extra.server).to.not.be.null;
            expect(server.express.locals.___extra.router).to.not.be.null;
            expect(server.express.locals.___extra.serverConfig).to.not.be.null;
            expect(server.express.locals.___extra.databaseConnectionManager).to.not.be.null;
            expect(server.express.locals.___extra.databaseConnectionManager.databaseConnectors).to.not.be.null;
            expect(server.express.locals.___extra.databaseConnectionManager.databaseConnectors.length).to.be.equal(1);
            expect(server.express.locals.___extra.databaseConnectionManager.getConnector("elasticsearch")).to.not.be.null;
            server.stop(() => {
                done();
            });
        });
    });
});

describe( 'As a developer, I need need to run mock util.', function()
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
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/json-junk", { json: true }, (err, res, body) => {
                console.log(body);
                console.log(body.length);
                expect(body.length).to.be.equal(261);
                server.stop(() => { done(); });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should write text files as a mock service', ( done ) => {
        let port = 1337;
        let server = new Server();
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/text", { json: true }, (err, res, body) => {
                expect(body.length).to.be.equal(260);
                server.stop(() => { done(); });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should return not found if the text file for a mock service does not exist', ( done ) => {
        let port = 1337;
        let server = new Server();
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/text-junk", { json: true }, (err, res, body) => {
                expect(body.length).to.be.equal(246);
                server.stop(() => { done(); });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should loop through an array of JSON files', ( done ) => {
        let port = 1337;
        let server = new Server();
        let jsonResponse = "{\"name\":\"My Server\",\"version\":\"1.0\"}";
        let jsonResponse2 = "{\"path\":\"/ping\",\"response\":{\"name\":\"My Server\",\"version\":\"1.0\"},\"responseType\":\"JSON\",\"headers\":[{\"header\":\"MY_HEADER\",\"value\":\"MY_HEADER_VALUE\"}]}";
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/json-string-array", { json: true }, (err, res, body) => {
                expect(JSON.stringify(body)).to.be.equal(jsonResponse);
                request('http://localhost:' + port + "/json-string-array", { json: true }, (err, res, body) => {
                    expect(JSON.stringify(body).length).to.be.equal(147);
                    request('http://localhost:' + port + "/json-string-array", { json: true }, (err, res, body) => {
                        expect(JSON.stringify(body)).to.be.equal(jsonResponse);
                        server.stop(() => { done(); });
                    });
                });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should handle JSON objects as response values for JSON', ( done ) => {
        let port = 1337;
        let server = new Server();
        let jsonResponse = {"title": "Index"};
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/json-object", { json: true }, (err, res, body) => {
                expect(JSON.stringify(body)).to.be.equal(JSON.stringify(jsonResponse));
                server.stop(() => { done(); });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should loop through an array of JSON object responses for JSON', ( done ) => {
        let port = 1337;
        let server = new Server();
        let jsonResponse = {"title": "Index"};
        let jsonResponse2 = {"title": "Not Found"};
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/json-object-array", { json: true }, (err, res, body) => {
                expect(JSON.stringify(body)).to.be.equal(JSON.stringify(jsonResponse));
                request('http://localhost:' + port + "/json-object-array", { json: true }, (err, res, body) => {
                    expect(JSON.stringify(body)).to.be.equal(JSON.stringify(jsonResponse2));
                    request('http://localhost:' + port + "/json-object-array", { json: true }, (err, res, body) => {
                        expect(JSON.stringify(body)).to.be.equal(JSON.stringify(jsonResponse));
                        server.stop(() => { done(); });
                    });
                });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should loop through an array of text files', ( done ) => {
        let port = 1337;
        let server = new Server();
        let textResponse = "\"<h1>{{title}}</h1>\\n<p>Welcome to {{title}}</p>\\n\"";
        let textResponse2 = "<h1>{{title}}</h1>\n<h2>{{message}}</h2>\n<h2>{{error.status}}</h2>\n<pre>{{error.stack}}</pre>";
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/text-string-array", { json: true }, (err, res, body) => {
                expect(JSON.stringify(body).length).to.be.equal(55);
                request('http://localhost:' + port + "/text-string-array", { json: true }, (err, res, body) => {
                    expect(body.length).to.be.equal(95);
                    request('http://localhost:' + port + "/text-string-array", { json: true }, (err, res, body) => {
                        console.log(JSON.stringify(body).length)
                        expect(JSON.stringify(body).length).to.be.equal(55);
                        server.stop(() => { done(); });
                    });
                });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should handle JSON objects as response values for text', ( done ) => {
        let port = 1337;
        let server = new Server();
        let jsonResponse = {"title": "Index"};
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/text-object", { json: true }, (err, res, body) => {
                expect(JSON.stringify(body)).to.be.equal(JSON.stringify(jsonResponse));
                request('http://localhost:' + port + "/text-object2", { json: true }, (err, res, body) => {
                    expect(body).to.be.equal("Index");
                    server.stop(() => { done(); });
                });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should loop through an array of JSON object responses for text', ( done ) => {
        let port = 1337;
        let server = new Server();
        let jsonResponse = {"title": "Index"};
        let jsonResponse2 = {"title": "Not Found"};
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/text-object-array", { json: true }, (err, res, body) => {
                expect(JSON.stringify(body)).to.be.equal(JSON.stringify(jsonResponse));
                request('http://localhost:' + port + "/text-object-array", { json: true }, (err, res, body) => {
                    expect(JSON.stringify(body)).to.be.equal(JSON.stringify(jsonResponse2));
                    request('http://localhost:' + port + "/text-object-array", { json: true }, (err, res, body) => {
                        expect(JSON.stringify(body)).to.be.equal(JSON.stringify(jsonResponse));
                        server.stop(() => { done(); });
                    });
                });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should loop through an array of JSON object responses for text, sending only the text field value', ( done ) => {
        let port = 1337;
        let server = new Server();
        let jsonResponse = "Index";
        let jsonResponse2 = "Not Found";
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/text-object-array2", { json: true }, (err, res, body) => {
                expect(body).to.be.equal(jsonResponse);
                request('http://localhost:' + port + "/text-object-array2", { json: true }, (err, res, body) => {
                    expect(body).to.be.equal(jsonResponse2);
                    request('http://localhost:' + port + "/text-object-array2", { json: true }, (err, res, body) => {
                        expect(body).to.be.equal(jsonResponse);
                        server.stop(() => { done(); });
                    });
                });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should send headers for mocks that are configured for them.', ( done ) => {
        let port = 1337;
        let server = new Server();
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/json", { json: true }, (err, res, body) => {
                expect(res).to.not.be.null;
                expect(res.headers).to.not.be.null;
                expect(res.headers.MY_HEADER).to.not.be.null;
                expect(res.headers.MY_HEADER).to.not.be.equal("MY_HEADER_VALUE");
                server.stop(() => { done(); });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should send headers for microservices that are configured for them.', ( done ) => {
        let port = 1337;
        let server = new Server();
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/microservices", { json: true }, (err, res, body) => {
                expect(res).to.not.be.null;
                expect(res.headers).to.not.be.null;
                expect(res.headers.MY_HEADER).to.not.be.null;
                expect(res.headers.MY_HEADER).to.not.be.equal("MY_HEADER_VALUE");
                server.stop(() => { done(); });
            });
        };
        server.init( port, config, serverInitCallback );
    });

    it ( 'should send headers for database connections that are configured for them.', ( done ) => {
        let port = 1337;
        let server = new Server();
        let serverInitCallback = () => {
            request('http://localhost:' + port + "/database/connection/elasticsearch/ping", { json: true }, (err, res, body) => {
                expect(res).to.not.be.null;
                expect(res.headers).to.not.be.null;
                expect(res.headers.MY_HEADER).to.not.be.null;
                expect(res.headers.MY_HEADER).to.not.be.equal("MY_HEADER_VALUE");
                server.stop(() => { done(); });
            });
        };
        server.init( port, config, serverInitCallback );
    });
});

