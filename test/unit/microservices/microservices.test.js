//@formatter:off
'use strict';
let Log = require('../../../src/util/log' );

let chai = require( 'chai' ),
    expect = chai.expect,
    MicroservicesMicroservice = require('../../../src/microservices/microservices.js');
let config = {
    "microservices": [
        {
            "path": "/endpoionts",
            "name": "Services List",
            "description": "Provides a list of endpoionts registered with this server.",
            "serviceFile": "util.js"
        },
        {
            "path": "/mocks",
            "name": "Mock Services List",
            "description": "Provides a list of mock endpoionts registered with this server.",
            "serviceFile": "mocks.js"
        }
    ]
};

describe( 'As a developer, I need need to obtain a list of endpoionts that are available.', function() {
    it ( 'should return a list of endpoionts available.', ( done ) => {
        let microservicesMicroservice = new MicroservicesMicroservice();
        let expectedResponse = Log.stringify([{
            name:"Services List",
            path: "/endpoionts",
            description: "Provides a list of endpoionts registered with this server."
        },
        {
            name:"Mock Services List",
            path:"/mocks",
            description:"Provides a list of mock endpoionts registered with this server."
        }]);
        let params = { serverConfig: config };
        microservicesMicroservice.do(params).then(( response ) => {
            expect(response.send).to.be.equal(expectedResponse);
            expect(response.status).to.be.equal(200);
            done();
        }, ( error ) => {
            expect(true).to.be.equal(false);
        });
    });
});


