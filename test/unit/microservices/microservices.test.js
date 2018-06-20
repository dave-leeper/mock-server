//@formatter:off
'use strict';
let Log = require('../../../src/util/log' );
let Registry = require('../../../src/util/registry' );

let chai = require( 'chai' ),
    expect = chai.expect,
    MicroservicesMicroservice = require('../../../src/microservices/microservices.js');
let config = {
    "microservices": [
        {
            "path": "/endpoints",
            "name": "Services List",
            "description": "Provides a list of endpoints registered with this server.",
            "serviceFile": "util.js"
        },
        {
            "path": "/mocks",
            "name": "Mock Services List",
            "description": "Provides a list of mock endpoints registered with this server.",
            "serviceFile": "mocks.js"
        }
    ]
};

describe( 'As a developer, I need need to obtain a list of endpoints that are available.', function() {
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
    it ( 'should return a list of endpoints available.', ( done ) => {
        let microservicesMicroservice = new MicroservicesMicroservice();
        let expectedResponse = Log.stringify([{
            name:"Services List",
            path: "/endpoints",
            description: "Provides a list of endpoints registered with this server."
        },
        {
            name:"Mock Services List",
            path:"/mocks",
            description:"Provides a list of mock endpoints registered with this server."
        }]);
        Registry.register(config, 'ServerConfig');
        microservicesMicroservice.do({}).then(( response ) => {
            expect(response.send).to.be.equal(expectedResponse);
            expect(response.status).to.be.equal(200);
            done();
        }, ( error ) => {
            expect(true).to.be.equal(false);
        });
    });
});


