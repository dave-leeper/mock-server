//@formatter:off
'use strict';
let Log = require('../../../src/util/log' );

let chai = require( 'chai' ),
    expect = chai.expect,
    MicroservicesMicroservice = require('../../../src/new-microservices/microservices.js');
let config = {
    "microservices": [
        {
            "path": "/microservices",
            "name": "Services List",
            "description": "Provides a list of microservices registered with this server.",
            "serviceFile": "util.js"
        },
        {
            "path": "/mocks",
            "name": "Mock Services List",
            "description": "Provides a list of mock microservices registered with this server.",
            "serviceFile": "mocks.js"
        }
    ]
};

describe( 'As a developer, I need need to obtain a list of microservices that are available.', function() {
    it ( 'should return a list of microservices available.', ( done ) => {
        let microservicesMicroservice = new MicroservicesMicroservice();
        let expectedResponse = Log.stringify([{
            name:"Services List",
            path: "/microservices",
            description: "Provides a list of microservices registered with this server."
        },
        {
            name:"Mock Services List",
            path:"/mocks",
            description:"Provides a list of mock microservices registered with this server."
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


