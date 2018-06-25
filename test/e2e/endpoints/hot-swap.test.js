//@formatter:off
'use strict';
let chai = require( 'chai' ),
    expect = chai.expect;
let MockRequest = require('../../mocks/mock-request' );
let MockResponse = require('../../mocks/mock-response' );
let Registry = require('../../../src/util/registry' );
let Server = require('../../../server.js');
let request = require('request');
let path = require("path");
let fs = require("fs");
let Log = require('../../../src/util/log' );

let server = new Server();
let port = '1337';
let config = {
    mocks: [
        {
            path: "/ping",
            response: { name: "My Server", version: "1.0" },
            responseType: "JSON"
        }
    ],
    endpoints: [
        {
            verb: "POST",
            path: "/hotswap",
            name: "Hot swap",
            description: "Hot swaps the server configuration.",
            serviceFile: "hot-swap.js"
        }
    ]
};

describe( 'As a developer, I need need to Hotswap the server with an API call', function() {
    before(() => {
    });
    beforeEach(( ) => {
        Registry.unregisterAll();
    });
    afterEach(( ) => {
    });
    after(() => {
    });
    it ( 'should hot-swap the server', ( done ) => {
        let newConfigFile = path.resolve('./test/e2e/endpoints', 'server-config2.json');
        let formData = { filename: fs.createReadStream(newConfigFile) };
        let hotSwapURL = 'http://localhost:' + port + '/hotswap';
        let pingURL = 'http://localhost:' + port + '/ping';
        server.init(port, config, () => {
            request( pingURL, { json: true }, (err1, res1, body1) => {
                expect( body1.name ).to.be.equal( 'My Server' );
                expect( body1.version ).to.be.equal( '1.0' );
                request.post({ url: hotSwapURL, formData: formData }, (err2, res2, body2) => {
                    expect(res2.statusCode).to.be.equal(200);
                    request( pingURL, { json: true }, (err3, res3, body3) => {
                        expect( body3.name ).to.be.equal( 'My Server' );
                        expect( body3.version ).to.be.equal( '2.0' );
                        server.stop(() => { done(); });
                    });
                });
            });
        });
    });
});

