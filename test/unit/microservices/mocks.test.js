//@formatter:off
'use strict';
let Log = require('../../../src/util/log' );

let chai = require( 'chai' ),
    expect = chai.expect,
    MocksMicroservice = require('../../../src/microservices/mocks.js');
let config = {
    "mocks": [
        {
            "path": "/json",
            "response": "./server-configure.json",
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
    ]
};

describe( 'As a developer, I need need to obtain a list of mocks that are available.', function() {
    it ( 'should return a list of mock util available.', ( done ) => {
        let mocksMicroservice = new MocksMicroservice();
        let expectedResponse = Log.stringify([{
            path:"/json",
            response:"./server-configure.json",
            responseType:"JSON"
        },
        {
            path:"/hbs",
            response:"index.hbs",
            responseType:"HBS"
        },
        {
            path:"/text",
            response:"./views/index.hbs",
            responseType:"TEXT"
        },
        {
            path:"/json-junk",
            response:"./JUNK.json",
            responseType:"JSON"
        },
        {
            path:"/text-junk",
            response:"./JUNK.tex",
            responseType:"TEXT"
        }]);
        let params = { serverConfig: config };
        mocksMicroservice.do(params).then((response) => {
            expect(response.send).to.be.equal(expectedResponse);
            expect(response.status).to.be.equal(200);
            done();
        }, ( error ) => {
            expect(true).to.be.equal(false);
        });
    });
});


