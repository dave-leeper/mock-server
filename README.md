# To Run 
<p><code>npm start</code></p>

# To Test 
<p><code>mocha "test/**/*.js"</code></p>

# To Start In-Memory Server 
<p><code>var Server = require('./server.js');<br/>
var port = MY_PORT_NUMBER;<br/>
var serverConfig = require('./MY_SERVER_CONFIG.json');<br/>
var server = new Server().init(port, serverConfig);</code></p>

# Config File
The config file is how you control the operation of the server.

## Mocks
Provides configuration information for mock services.
Mock services send data from files back to the client.
### Fields
* **verb**<br/>
Example: "POST"<br/>
The HTTP verb. Optional. Defaults to GET.
* **path**<br/>
Example: "/json"<br/>
The URL path that invokes the mock.
* **response**<br/>
Example: "./server-config.json"<br/>
The location of the response file.
An array of response file paths can also be used. The server will cycle
through the array, advancing with each request.<br/>
A parameter token can be added to the end of the response and that token 
will be replaced with the value of the query parameter with the same
name.<br>
Example: "./:id"<br/>
The file whose name matches the value of the :id query parameter will be
returned.<br/>
* **responseType**<br/>
Example: "JSON"<br/>
The type of data in the response file. Valid values
are JSON, TEXT, BLOB, and HBS (a Handlebars template file).
* **headers**<br/>
Example: [ { "header": "Access-Control-Allow-Origin", "value": "*" } ]<br/>
An array of headers that should be included in the response.
* **hbsData**<br/>
Example: {"title": "Index"}<br/>
A JSON object that should be sent to the
Handlebars template (used only for HBS type files). If an array is used
in the response field, and array of equal size should also be used in
the hbsData field.
* **mimeType**<br/>
Example: {"title": "Index"}<br/>

### Examples
* A mock service at GET /ping. It returns a JSON object and sets a header
named MY_HEADER to MY_HEADER_VALUE.
  <p><code>"mocks": [<br/>
    {<br/>
        "path": "/ping",<br/>
        "response": {"name":"My Server","version":"1.0"},<br/>
        "responseType": "JSON",<br/>
        "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]<br/>
    }]</code></p>

* A mock service that returns JSON objects read from files. There are
multiple files. They will be returned one after the other on multiple
requests.
  <p><code>"mocks": [<br/>
    {<br/>
        "path": "/json-string-array",<br/>
        "response": ["./server-config.json", "./test/test-data.json"],<br/>
        "responseType": "JSON",<br/>
    }]</code></p>

* A mock service that sends a JSON object as a response. A Handlebars
form, index.hbs, is used to display the data. Handlebars forms are in
the views directory.
  <p><code>"mocks": [<br/>
    {<br/>
        "path": "/hbs",<br/>
        "response": "index.hbs",<br/>
        "responseType": "HBS",<br/>
        "hbsData": {"title": "Index"},<br/>
    }]</code></p>

* A mock service that sends multiple JSON objects as a response.
Handlebars forms are used to display the data. The objects and forms
will cycle through one per request.
  <p><code>"mocks": [<br/>
    {<br/>
        "path": "/hbs-string-array",<br/>
        "response": [ "index.hbs", "error.hbs" ],<br/>
        "responseType": "HBS",<br/>
        "hbsData": [ {"title": "Index"}, {"title": "Not Found"} ],<br/>
    }]</code></p>

* A mock service that returns a text file as a response.
  <p><code>"mocks": [<br/>
    {<br/>
        "path": "/text",<br/>
        "response": "./views/index.hbs",<br/>
        "responseType": "TEXT",<br/>
    }]</code></p>

* A mock service that sends multiple text files as a response, one per
request.
  <p><code>"mocks": [<br/>
    {<br/>
        "path": "/text-string-array",<br/>
        "response": [ "./views/index.hbs", "./views/error.hbs" ],<br/>
        "responseType": "TEXT",<br/>
    }]</code></p>

* A mock service that presents a file upload form to the client and
stores the uploaded file in the files directory. The hbsData field is
required and the JSON must have the title text, action URL, and HTTP
verb fields.
  <p><code>"mocks": [<br/>
    {<br/>
        "path": "/uploadfile",<br/>
        "response": "upload.hbs",<br/>
        "responseType": "HBS",<br/>
        "hbsData": {"title": "Upload File", "action": "upload", "verb": "POST"}<br/>
    }]</code></p>

## Microservices
Provides simple services that should take only a few seconds to execute.
Microservices have a do(req, res, router, serviceInfo) method that
returns a promise.
The promise is fulfilled when the microservice completes a request.
Microservices are stateless and have no lifecycle. A microservice object
 will be instantiated every time a request to the microservice is made.
### Fields
* **verb**<br/>
Example: "POST"<br/>
The HTTP verb. Optional. Defaults to GET.
* **path**<br/>
Example: "/throw"<br/>
The URL path that invokes the microservice.
* **name**<br/>
Example: "Throw Exception"<br/>
The human-readable name of the microservice.
* **description**<br/>
Example: "A micro service that throws an exception. For testing purposes."<br/>
A short human-readable description of the microservice.<br/>
* **serviceFile**<br/>
Example: "/throw.js"<br/>
The name of the javascript file containing the
microservice. These names are relative to the microservices directory.
* **serviceData**<br/>
Example: { "name": "My Server", "version": "1.0" }<br/>
An optional
field that provides a JSON object for use by the micro service.
* **headers**<br/>
Example: [[ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]]<br/>
An optional array of headers that should be included in the response.

### Examples
 * A microservice service at GET /download/:name that downloads the file
 :name from the files directory. The microservices/download.js file
 contains the code for the service.
    <p><code>"microservices": [<br/>
    {<br/>
        "path": "/download/:name",<br/>
        "name": "File Download",<br/>
        "description": "Downloads a file from the files directory of the server. The :name Parameter is the file name.",<br/>
        "serviceFile": "download.js"<br/>
    }]</code></p>

## DatabaseConnections
Database connections are used to work with databases. All database
connections listed in the server config file will be automatically
connected to their respective databases.

Use the DatabaseConnectorManager to disconnect all database connections
or to obtain an individual database connection object by name.

Each database connection object has methods to connect, disconnect, and
ping that connection.
### Fields
* **name**<br/>
Example: "elasticsearch"<br/>
The name given to a connection.A database can have multiple connections,
each with a unique name.
* **description"**<br/>
Example: "Elasticsearch service."<br/>
A short human-readable description of the database connection.
* **databaseConnector**<br/>
Example: "elasticsearch.js"<br/>
The name of the javascript file containing the database connection
class. These names are relative to the database-connectors directory.
* **config**<br/>
Example: { "host": "localhost:9200", "log": "trace" }<br/>
A JSON object that will be passed to the database connector class. It
contains any information needed to configure the connection. It is up to
the database connector class to interpret this data. This field is
ignored when the connector is set up to use a backend database server
using the backendURL parameter.
* **generateConnectionAPI**<br/>
Example: true<br/>
A boolean value indicating if connection REST APIs should be generated
for the connection. Optional. Defaults to false. These APIs are
described in the API section, below.
* **generateIndexAPI**<br/>
Example: true<br/>
A boolean value indicating if index REST APIs should be generated for
the connection. Optional. Defaults to false. These APIs are described in
the API section, below.
### Examples
 * A simple config for Elasticsearch.
  <code>"databaseConnections" : [<br/>
    {<br/>
      "name": "elasticsearch",<br/>
      "description": "Elasticsearch service.",<br/>
      "databaseConnector": "elasticsearch.js",<br/>
      "generateConnectionAPI": true,<br/>
      "generateIndexAPI": true,<br/>
      "generateDataAPI": true,<br/>
      "config": {<br/>
        "host": "localhost:9200",<br/>
        "log": "trace"<br/>
      }<br/>
    }]</code>

### API
By default, the database APIs are not generated. See the fields section,
above, for information on how to set the flags needed to generate the
APIs.

The intent of the APIs is to quickly and easily provide endpoints for
basic database operations.

#### Connection API
* **GET database-connection-name/connection/connect**<br/>
Connects to the database.
* **GET database-connection-name/connection/disconnect**<br/>
Disconnects from the database.
* **GET database-connection-name/connection/ping**<br/>
Pings the database connection.

#### Index API
* **GET database-connection-name/index/:index/exists**<br/>
Determines if the index named :index exists.
* **POST database-connection-name/index**<br/>
Creates an index. The body of the request has a JSON object indicating
the index name. Example:<br/>
<code>{ index: "test" }</code>
* **DELETE database-connection-name/index/:index**<br/>
Drops the index indicated by the :index parameter.
* **POST database-connection-name/index/mapping**<br/>
Creates a mapping in an index. The body of the request has a JSON
object indicating the mapping information. Example:
<br/><code>{<br/>
    index: "test",<br/>
    type: "document",<br/>
    body: {<br/>
        properties: {<br/>
            title: { type: "string" },<br/>
            content: { type: "string" },<br/>
            suggest: {<br/>
                type: "completion",<br/>
                analyzer: "simple",<br/>
                search_analyzer: "simple"<br/>
            }<br/>
        }<br/>
    }<br/>
}</code>

#### Data API
* **POST database-connection-name/data/:index/:type/:id**<br/>
Inserts the data in the body of the request into the database. Example:
<br/><code>{<br/>
  "title": "my title",<br/>
  "content": "my content",<br/>
  "suggest": "my suggest"<br/>
}</code>

* **GET database-connection-name/data/:index/:type/:id**<br/>
Selects data from the database. If the :id parameter is set to _all, all
records from the index/type are returned. Query parameters can be used
in conjunction with the _all id to narrow down the results. Use the
_size and _from query parameters to handle the page size of the returned
values. The data returned is a status and an array of matching records.
Example:
<br/><code>{<br/>
  "status":"success",<br/>
  "data": [{<br/>
  "title":"title2",<br/>
  "content":"content2",<br/>
  "suggest":"suggest2"},<br/>
  {"title":"my title",<br/>
  "content":"my content",<br/>
  "suggest":"my suggest"}]<br/>
}</code>

##### Examples
* **GET database-connection-name/data/test/my-type/1**<br/>
Gets the data of type my-type from index test with an _id value of 1.
* **GET database-connection-name/data/test/my-type/_all**<br/>
Gets all data of type my-type from index test.
* **GET database-connection-name/data/test/my-type/_all?title=my+title**<br/>
Gets all data of type my-type from index test where title = "my title".
* **GET database-connection-name/data/test/my-type/_all?title=my+title&content=my+content**<br/>
Gets all data of type my-type from index test where title equals "my title"
and content equals "my content".
* **GET database-connection-name/data/test/my-type/_all?title=my+title&_size=5&_from=50**<br/>
Gets all data of type my-type from index test where title = "my title".
Only five records are returned, starting from the 50th record of the results.


