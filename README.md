# To Run 
npm start

# To Test 
mocha "test/**/*.js"

# To Start In-Memory Server 
var Server = require('./server.js');

var port = MY_PORT_NUMBER;

var serverConfig = require('./MY_SERVER_CONFIG.json');

var server = new Server().init(port, serverConfig);

# Config File
The config file is how you control the operation of the server.

## Mocks
Provides configuration information for mock services.
Mock services send data from files back to the client.
### Fields
* path "/json" - The URL path that invokes the mock.
* responseFile "./server-config.json - The location of the response file.
* fileType "JSON" - The type of data in the response file. Valid values
are JSON, TEXT, and HBS (a Handlebars template file).
* headers [[ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]] -
An array of headers that should be included in the response.
* hbsData {"title": "Index"} - A JSON object that should be sent to the
Handlebars template (used only for HBS type files).

## Microservices
Provides simple services that should take only a few seconds to execute.
Microservices have a do(req, res, router, serviceInfo) method that
returns a promise.
The promise is fulfilled when the microservice completes a request.
Microservices are stateless and have no lifecycle. A microservice object
 will be
instantiated every time a request to the microservice is made.
### Fields
* path "/ping" - The URL path that invokes the microservice.
* name "Ping" - The human-readable name of the microservice.
* description" "A basic ping service." - A short human-readable
 description of the microservice.
serviceFile "ping.js" - The name of the javascript file containing the
microservice. These names are relative to the microservices directory.
* serviceData { "name": "My Server", "version": "1.0" } - An optional
field that provides a JSON object for use by the micro service.
Currently used only by the ping micro service, where it stores the
response sent to the client.
* headers [[ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]] -
An array of headers that should be included in the response.

## DatabaseConnections
Database connections are used to work with databases. All database
connections listed in the server config file will be automatically
connected to their respective databases.

Use the DatabaseConnectorManager to disconnect all database connections
or to obtain an individual database connection object by name.

Each database connection object has methods to connect, disconnect, and
ping that connection.

### Fields
* name "elasticsearch" - The name given to a connection.A database can
have multiple connections, each with a unique name.
* description": "Elasticsearch service." - A short human-readable
description of the database connection.
* databaseConnector "elasticsearch.js" - The name of the javascript file
containing the database connection class. These names are relative to
the database-connectors directory.
* config { "host": "localhost:9200", "log": "trace" } - A JSON object
that will be passed to the database connector class. It contains any
information needed to configure the connection. It is up to the
database connector class to interpret this data.

# Object Layout
Server (Server.js object)

+- express (Express server)

| ++- Router (Router class)

+- server (HTTP server)

+- serverConfig (Config file loaded into memory)

+- databaseConnectorManager (Database Connection Manager)

The server object has express, server, serverConfig, and
databaseConnectorManager objects. The express object has the Router
class.





