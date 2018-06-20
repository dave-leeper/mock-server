//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    MockRequest = require('../../mocks/mock-request.js'),
    MockResponse = require('../../mocks/mock-response.js'),
    MockExpressRouter = require('../../mocks/mock-express-router.js'),
    RouteBuilderMocks = require('../../../src/routers/route-builder-mocks.js');
let config = {
    "mocks": [
        {
            "path": "/json",
            "response": "./test/test-data.json",
            "responseType": "JSON",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "verb": "OPTIONS",
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
        },
        {
            "verb": "POST",
            "path": "/post_path",
            "response": {"text": "Not Found"},
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "verb": "PUT",
            "path": "/put_path",
            "response": {"text": "Not Found"},
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "verb": "PATCH",
            "path": "/patch_path",
            "response": {"text": "Not Found"},
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
        {
            "verb": "DELETE",
            "path": "/delete_path",
            "response": {"text": "Not Found"},
            "responseType": "TEXT",
            "headers": [ { "header": "MY_HEADER", "value": "MY_HEADER_VALUE" } ]
        },
    ]
};

let containsPath = (array, path) => {
    for (let loop = 0; loop < array.length; loop++) {
        if (array[loop].path === path) return true;
    }
    return false;
};
let hasHandler = (array, path) => {
    for (let loop = 0; loop < array.length; loop++) {
        if (array[loop].path === path) return !!(array[loop].handler);
    }
    return false;
};
let expectSendString = (mockResponse) => {
    let expectedSendString = JSON.parse("{ \"name\": \"My Server\", \"version\": \"1.0\" }");
    let sendString = JSON.parse(mockResponse.sendString);
    expect(sendString.name).to.be.equal(expectedSendString.name);
    expect(sendString.version).to.be.equal(expectedSendString.version);
};
let expectSendString2 = (mockResponse) => {
    let expectedSendString = JSON.parse("{ \"path\": \"/ping\", \"response\": { \"name\": \"My Server\", \"version\": \"1.0\"}, \"responseType\": \"JSON\", \"headers\": [ { \"header\": \"MY_HEADER\", \"value\": \"MY_HEADER_VALUE\" } ]}");
    let sendString = JSON.parse(mockResponse.sendString);
    expect(sendString.name).to.be.equal(expectedSendString.name);
    expect(sendString.version).to.be.equal(expectedSendString.version);
};
let expectRender = (mockResponse, responseFile) => {
    const expectedError = {
        title: responseFile,
        message: 'File Not Found: ' + responseFile + '.',
        error: {status: 404}
    };
    expect(mockResponse.renderString).to.be.equal('error');
    expect(mockResponse.renderObject.title).to.be.equal(expectedError.title);
    expect(mockResponse.renderObject.message).to.be.equal(expectedError.message);
    expect(mockResponse.renderObject.error.status).to.be.equal(expectedError.error.status);
};
let expectHeadersAndCookies = (mockResponse) => {
    expect(mockResponse.headers).to.not.be.null;
    expect(Array.isArray(mockResponse.headers)).to.be.equal(true);
    expect(mockResponse.headers.length).to.be.equal(1);
    expect(mockResponse.headers[0]).to.not.be.null;
    expect(mockResponse.headers[0].header).to.be.equal('Access-Control-Allow-Origin');
    expect(mockResponse.headers[0].value).to.be.equal('*');
    expect(mockResponse.cookies).to.not.be.null;
    expect(Array.isArray(mockResponse.cookies)).to.be.equal(true);
    expect(mockResponse.cookies.length).to.be.equal(1);
    expect(mockResponse.cookies[0].name).to.be.equal('MY_COOKIE');
    expect(mockResponse.cookies[0].value).to.be.equal('MY_COOKIE_VALUE');
};
describe( 'As a developer, I need an API for creating database connections', function() {
    before(() => {
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    after(() => {
    });
    it ( 'should not build routes using bad parameters', ( ) => {
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockExpressRouter = new MockExpressRouter();
        let result = routeBuilderMocks.connect( null, null );
        expect(result).to.be.equal(false);
        result = routeBuilderMocks.connect( {}, {} );
        expect(result).to.be.equal(false);
        result = routeBuilderMocks.connect( mockExpressRouter, {} );
        expect(result).to.be.equal(false);
        result = routeBuilderMocks.connect( {}, config );
        expect(result).to.be.equal(false);
    });
    it ( 'should be build routes to handlers based on config information', ( ) => {
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockExpressRouter = new MockExpressRouter();
        let result = routeBuilderMocks.connect( mockExpressRouter, config );
        expect(result).to.be.equal(true);
        expect(mockExpressRouter.gets.length).to.be.equal(14);
        expect(mockExpressRouter.option.length).to.be.equal(1);
        expect(mockExpressRouter.posts.length).to.be.equal(1);
        expect(mockExpressRouter.puts.length).to.be.equal(1);
        expect(mockExpressRouter.patches.length).to.be.equal(1);
        expect(mockExpressRouter.deletes.length).to.be.equal(1);
        expect(containsPath(mockExpressRouter.gets, '/json')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.gets, '/hbs')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.gets, '/text')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.gets, '/json-junk')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.gets, '/text-junk')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.gets, '/json-string-array')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.gets, '/json-object')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.gets, '/json-object-array')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.gets, '/hbs-string-array')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.gets, '/text-string-array')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.gets, '/text-object')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.gets, '/text-object2')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.gets, '/text-object-array')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.gets, '/text-object-array2')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.option, '/json')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.posts, '/post_path')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.puts, '/put_path')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.patches, '/patch_path')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.deletes, '/delete_path')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/json')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/hbs')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/text')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/json-junk')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/text-junk')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/json-string-array')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/json-object')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/json-object-array')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/hbs-string-array')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/text-string-array')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/text-object')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/text-object2')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/text-object-array')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/text-object-array2')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.option, '/json')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.posts, '/post_path')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.puts, '/put_path')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.patches, '/patch_path')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.deletes, '/delete_path')).to.be.equal(true);
    });
    it ( 'should build handlers that processes a path to a JSON file', ( ) => {
        let mock = {
            path: '/json',
            response: './test/data/test-data.json',
            responseType: 'JSON',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let handler = routeBuilderMocks.___buildJSONFileHandlerFromString( mock );
        expect(handler).to.not.be.null;
        handler(mockRequest, mockResponse);
        expectSendString(mockResponse);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/json',
            response: './god/knows/where.json',
            responseType: 'JSON',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        handler = routeBuilderMocks.___buildJSONFileHandlerFromString( mock );
        handler(mockRequest, mockResponse);
        expectRender(mockResponse, mock.response);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/json/:replace_me',
            response: './test/data/:replace_me',
            responseType: 'JSON',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.params.replace_me = 'test-data.json';
        handler = routeBuilderMocks.___buildJSONFileHandlerFromString( mock );
        handler(mockRequest, mockResponse);
        expectSendString(mockResponse);
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.query.replace_me = 'test-data.json';
        handler = routeBuilderMocks.___buildJSONFileHandlerFromString( mock );
        handler(mockRequest, mockResponse);
        expectSendString(mockResponse);
        expectHeadersAndCookies(mockResponse);
    });
    it ( 'should build handlers that processes a handlebars file', ( ) => {
        let mock = {
            path: '/hbs',
            response: './src/views/index.hbs',
            responseType: 'HBS',
            hbsData: { 'title': 'Index' },
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let handler = routeBuilderMocks.___buildHandlebarsFileHandlerFromString( mock );
        expect(handler).to.not.be.null;
        handler(mockRequest, mockResponse);
        expect(mockResponse.renderString).to.be.equal('./src/views/index.hbs');
        expect(mockResponse.renderObject.title).to.be.equal('Index');
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/hbs',
            response: 'JUNK.hbs',
            responseType: 'HBS',
            hbsData: { 'title': 'Index' },
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        handler = routeBuilderMocks.___buildHandlebarsFileHandlerFromString( mock );
        handler(mockRequest, mockResponse);
        expectRender(mockResponse, mock.response);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/hbs/:replace_me',
            response: './src/views/:replace_me',
            responseType: 'HBS',
            hbsData: { 'title': 'Index' },
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.params.replace_me = 'index.hbs';
        handler = routeBuilderMocks.___buildHandlebarsFileHandlerFromString( mock );
        handler(mockRequest, mockResponse);
        expect(mockResponse.renderString).to.be.equal('./src/views/index.hbs');
        expect(mockResponse.renderObject.title).to.be.equal('Index');
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.query.replace_me = 'index.hbs';
        handler = routeBuilderMocks.___buildHandlebarsFileHandlerFromString( mock );
        handler(mockRequest, mockResponse);
        expect(mockResponse.renderString).to.be.equal('./src/views/index.hbs');
        expect(mockResponse.renderObject.title).to.be.equal('Index');
        expectHeadersAndCookies(mockResponse);
    });
    it ( 'should build handlers that processes a path to a text file', ( ) => {
        let mock = {
            path: '/text',
            response: './test/data/test-data.json',
            responseType: 'TEXT',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let handler = routeBuilderMocks.___buildTextFileHandlerFromString( mock );
        expect(handler).to.not.be.null;
        handler(mockRequest, mockResponse);
        expectSendString(mockResponse);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/text',
            response: './god/knows/where.json',
            responseType: 'TEXT',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        handler = routeBuilderMocks.___buildTextFileHandlerFromString( mock );
        handler(mockRequest, mockResponse);
        expectRender(mockResponse, mock.response);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/text/:replace_me',
            response: './test/data/:replace_me',
            responseType: 'TEXT',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.params.replace_me = 'test-data.json';
        handler = routeBuilderMocks.___buildTextFileHandlerFromString( mock );
        handler(mockRequest, mockResponse);
        expectSendString(mockResponse);
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.query.replace_me = 'test-data.json';
        handler = routeBuilderMocks.___buildTextFileHandlerFromString( mock );
        handler(mockRequest, mockResponse);
        expectSendString(mockResponse);
        expectHeadersAndCookies(mockResponse);
    });
    it ( 'should build handlers that processes a path to a BLOB file', ( ) => {
        let mock = {
            path: '/blob',
            response: './public/files/user2.png',
            responseType: 'BLOB',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let handler = routeBuilderMocks.___buildBLOBFileHandlerFromString( mock );
        expect(handler).to.not.be.null;
        handler(mockRequest, mockResponse);
        expect(mockResponse.sendfile).to.be.equal(mock.response);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/blob',
            response: './god/knows/where.json',
            responseType: 'BLOB',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        handler = routeBuilderMocks.___buildBLOBFileHandlerFromString( mock );
        handler(mockRequest, mockResponse);
        expectRender(mockResponse, mock.response);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/blob/:replace_me',
            response: './public/files/:replace_me',
            responseType: 'BLOB',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.params.replace_me = 'user2.png';
        handler = routeBuilderMocks.___buildBLOBFileHandlerFromString( mock );
        handler(mockRequest, mockResponse);
        expect(mockResponse.sendfile).to.be.equal('./public/files/user2.png');
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.query.replace_me = 'user2.png';
        handler = routeBuilderMocks.___buildBLOBFileHandlerFromString( mock );
        handler(mockRequest, mockResponse);
        expect(mockResponse.sendfile).to.be.equal('./public/files/user2.png');
        expectHeadersAndCookies(mockResponse);
    });
    it ( 'should be able to store and increment indexes on a mock\'s config object', ( ) => {
        let mock = {
            path: '/blob',
            response: [ './public/files/user1.jpg', './public/files/user2.png', './public/files/user3.jpg' ],
            responseType: 'BLOB',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        let index = RouteBuilderMocks.___getIndex(mock);
        expect(index).to.be.equal(0);
        RouteBuilderMocks.___incrementIndex(mock);
        index = RouteBuilderMocks.___getIndex(mock);
        expect(index).to.be.equal(1);
        RouteBuilderMocks.___incrementIndex(mock);
        index = RouteBuilderMocks.___getIndex(mock);
        expect(index).to.be.equal(2);
        RouteBuilderMocks.___incrementIndex(mock); // loop
        index = RouteBuilderMocks.___getIndex(mock);
        expect(index).to.be.equal(0);
    });
    it ( 'should build handlers that processes an array of paths to JSON files', ( ) => {
        let mock = {
            path: '/json',
            response: [ './test/data/test-data.json', './test/data/test-data2.json' ],
            responseType: 'JSON',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let handler = routeBuilderMocks.___buildJSONFileHandlerFromArrayOfStrings( mock );
        expect(handler).to.not.be.null;
        handler(mockRequest, mockResponse);
        expectSendString(mockResponse);
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        handler(mockRequest, mockResponse);
        expectSendString2(mockResponse);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/json',
            response: [ './god/knows/where.json', './test/data/test-data2.json' ],
            responseType: 'JSON',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        handler = routeBuilderMocks.___buildJSONFileHandlerFromArrayOfStrings( mock );
        handler(mockRequest, mockResponse);
        expectRender(mockResponse, mock.response[0]);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/json/:replace_me',
            response: [ './test/data/:replace_me', './test/data/:replace_me' ],
            responseType: 'JSON',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.params.replace_me = 'test-data.json';
        handler = routeBuilderMocks.___buildJSONFileHandlerFromArrayOfStrings( mock );
        handler(mockRequest, mockResponse);
        expectSendString(mockResponse);
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.query.replace_me = 'test-data2.json';
        handler = routeBuilderMocks.___buildJSONFileHandlerFromArrayOfStrings( mock );
        handler(mockRequest, mockResponse);
        expectSendString2(mockResponse);
        expectHeadersAndCookies(mockResponse);
    });
    it ( 'should build handlers that processes an array of paths to Handlebars files', ( ) => {
        let mock = {
            path: '/hbs',
            response: [ './src/views/index.hbs', './src/views/message.hbs' ],
            responseType: 'HBS',
            hbsData: [{ 'title': 'Index' }, { 'title': 'Message', 'message': 'Message', 'status': 200 }],
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let handler = routeBuilderMocks.___buildHandlebarsFileHandlerFromArrayOfStrings( mock );
        expect(handler).to.not.be.null;
        handler(mockRequest, mockResponse);
        expect(mockResponse.renderString).to.be.equal('./src/views/index.hbs');
        expect(mockResponse.renderObject.title).to.be.equal('Index');
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        handler(mockRequest, mockResponse);
        expect(mockResponse.renderString).to.be.equal('./src/views/message.hbs');
        expect(mockResponse.renderObject.title).to.be.equal('Message');
        expect(mockResponse.renderObject.message).to.be.equal('Message');
        expect(mockResponse.renderObject.status).to.be.equal(200);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/hbs',
            response: [ 'JUNK.hbs', './src/views/message.hbs' ],
            responseType: 'HBS',
            hbsData: { 'title': 'Index' },
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        handler = routeBuilderMocks.___buildHandlebarsFileHandlerFromArrayOfStrings( mock );
        handler(mockRequest, mockResponse);
        expectRender(mockResponse, mock.response[0]);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/hbs/:replace_me',
            response: [ './src/views/:replace_me', './src/views/:replace_me' ],
            responseType: 'HBS',
            hbsData: [{ 'title': 'Index' }, { 'title': 'Message', 'message': 'Message', 'status': 200 }],
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.params.replace_me = 'index.hbs';
        handler = routeBuilderMocks.___buildHandlebarsFileHandlerFromArrayOfStrings( mock );
        handler(mockRequest, mockResponse);
        expect(mockResponse.renderString).to.be.equal('./src/views/index.hbs');
        expect(mockResponse.renderObject.title).to.be.equal('Index');
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.query.replace_me = 'message.hbs';
        handler = routeBuilderMocks.___buildHandlebarsFileHandlerFromArrayOfStrings( mock );
        handler(mockRequest, mockResponse);
        expect(mockResponse.renderString).to.be.equal('./src/views/message.hbs');
        expect(mockResponse.renderObject.title).to.be.equal('Message');
        expect(mockResponse.renderObject.message).to.be.equal('Message');
        expect(mockResponse.renderObject.status).to.be.equal(200);
        expectHeadersAndCookies(mockResponse);
    });
    it ( 'should build handlers that processes an array of paths to text files', ( ) => {
        let mock = {
            path: '/text',
            response: [ './test/data/test-data.json', './test/data/test-data2.json' ],
            responseType: 'TEXT',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let handler = routeBuilderMocks.___buildTextFileHandlerFromArrayOfStrings( mock );
        expect(handler).to.not.be.null;
        handler(mockRequest, mockResponse);
        expectSendString(mockResponse);
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        handler(mockRequest, mockResponse);
        expectSendString2(mockResponse);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/text',
            response: [ './god/knows/where.json', './test/data/test-data2.json' ],
            responseType: 'TEXT',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        handler = routeBuilderMocks.___buildTextFileHandlerFromArrayOfStrings( mock );
        handler(mockRequest, mockResponse);
        expectRender(mockResponse, mock.response[0]);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/text/:replace_me',
            response: [ './test/data/:replace_me', './test/data/:replace_me' ],
            responseType: 'TEXT',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.params.replace_me = 'test-data.json';
        handler = routeBuilderMocks.___buildTextFileHandlerFromArrayOfStrings( mock );
        handler(mockRequest, mockResponse);
        expectSendString(mockResponse);
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.query.replace_me = 'test-data2.json';
        handler = routeBuilderMocks.___buildTextFileHandlerFromArrayOfStrings( mock );
        handler(mockRequest, mockResponse);
        expectSendString2(mockResponse);
        expectHeadersAndCookies(mockResponse);
    });
    it ( 'should build handlers that processes an array of paths to BLOB files', ( ) => {
        let mock = {
            path: '/blob',
            response: [ './public/files/user2.png', './public/files/user3.jpg' ],
            responseType: 'BLOB',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let handler = routeBuilderMocks.___buildBLOBFileHandlerFromArrayOfStrings( mock );
        expect(handler).to.not.be.null;
        handler(mockRequest, mockResponse);
        expect(mockResponse.sendfile).to.be.equal(mock.response[0]);
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        handler(mockRequest, mockResponse);
        expect(mockResponse.sendfile).to.be.equal(mock.response[1]);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/blob',
            response: [ './god/knows/where.json', './public/files/user3.jpg' ],
            responseType: 'BLOB',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        handler = routeBuilderMocks.___buildBLOBFileHandlerFromArrayOfStrings( mock );
        handler(mockRequest, mockResponse);
        expectRender(mockResponse, mock.response[0]);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/blob/:replace_me',
            response: [ './public/files/:replace_me', './public/files/:replace_me' ],
            responseType: 'BLOB',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.params.replace_me = 'user2.png';
        handler = routeBuilderMocks.___buildBLOBFileHandlerFromArrayOfStrings( mock );
        handler(mockRequest, mockResponse);
        expect(mockResponse.sendfile).to.be.equal('./public/files/user2.png');
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        mockRequest.query.replace_me = 'user3.jpg';
        handler = routeBuilderMocks.___buildBLOBFileHandlerFromArrayOfStrings( mock );
        handler(mockRequest, mockResponse);
        expect(mockResponse.sendfile).to.be.equal('./public/files/user3.jpg');
        expectHeadersAndCookies(mockResponse);
    });
    it ( 'should build handlers that processes a JSON object', ( ) => {
        let mock = {
            path: '/json',
            response: { name: 'My Server', version: '1.0' },
            responseType: 'JSON',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let handler = routeBuilderMocks.___buildJSONHandlerFromObject( mock );
        expect(handler).to.not.be.null;
        handler(mockRequest, mockResponse);
        expectSendString(mockResponse);
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/json',
            response: 'JUNK',
            responseType: 'JSON',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        handler = routeBuilderMocks.___buildJSONHandlerFromObject( mock );
        handler(mockRequest, mockResponse);
        expect(mockResponse.sendString).to.be.equal('"JUNK"');
        expectHeadersAndCookies(mockResponse);
    });
    it ( 'should build handlers that processes a JSON object for text', ( ) => {
        let mock = {
            path: '/text',
            response: { text: 'Text' },
            responseType: 'TEXT',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let handler = routeBuilderMocks.___buildTextHandlerFromObject( mock );
        expect(handler).to.not.be.null;
        handler(mockRequest, mockResponse);
        expect(mockResponse.sendString).to.be.equal('Text');
        expectHeadersAndCookies(mockResponse);
        mock = {
            path: '/json',
            response: { message: 'Text' },
            responseType: 'JSON',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        mockRequest.reset();
        mockResponse.reset();
        handler = routeBuilderMocks.___buildTextHandlerFromObject( mock );
        handler(mockRequest, mockResponse);
        expect(mockResponse.sendString).to.be.equal(JSON.stringify(mock.response));
        expectHeadersAndCookies(mockResponse);
    });
    it ( 'should build handlers that processes an array of JSON objects', ( ) => {
        let mock = {
            path: '/json',
            response: [{ name: 'My Server', version: '1.0' }, { path: '/ping', response: { name: 'My Server', version: '1.0'}, responseType: 'JSON', headers: [ { header: 'MY_HEADER', value: 'MY_HEADER_VALUE' }]}],
            responseType: 'JSON',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let handler = routeBuilderMocks.___buildJSONHandlerFromArrayOfObjects( mock );
        expect(handler).to.not.be.null;
        handler(mockRequest, mockResponse);
        expectSendString(mockResponse);
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        handler(mockRequest, mockResponse);
        expectSendString2(mockResponse);
        expectHeadersAndCookies(mockResponse);
    });
    it ( 'should build handlers that processes an array of  JSON objects for text', ( ) => {
        let mock = {
            path: '/text',
            response: [{ text: 'Text' }, { message: 'Text' }],
            responseType: 'TEXT',
            headers: [{ header: 'Access-Control-Allow-Origin', value: '*' }],
            cookies: [{ name : 'MY_COOKIE', value: 'MY_COOKIE_VALUE' }]
        };
        let routeBuilderMocks = new RouteBuilderMocks();
        let mockRequest = new MockRequest();
        let mockResponse = new MockResponse();
        let handler = routeBuilderMocks.___buildTextHandlerFromArrayOfObjects( mock );
        expect(handler).to.not.be.null;
        handler(mockRequest, mockResponse);
        expect(mockResponse.sendString).to.be.equal('Text');
        expectHeadersAndCookies(mockResponse);
        mockRequest.reset();
        mockResponse.reset();
        handler(mockRequest, mockResponse);
        expect(mockResponse.sendString).to.be.equal(JSON.stringify(mock.response[1]));
        expectHeadersAndCookies(mockResponse);
    });
});
