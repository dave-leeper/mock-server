//@formatter:off
'use strict';

let fs = require("fs");
let path = require("path");
let chai = require( 'chai' ),
    expect = chai.expect,
    Server = require('../../../server.js'),
    request = require('request');
let config = {
    mocks: [
        {
            path: "/ping",
            response: { name:"My Server", version:"1.0"},
            responseType: "JSON"
        }
    ],
    microservices: [
        {
            path: "/microservices",
            name: "Microservices",
            description: "Displays a list of available microservices.",
            serviceFile: "microservices.js"
        }
    ],
    endpoints: [
        {
            verb: "POST",
            path: "/hotswap",
            name: "Hotswap",
            description: "Hotswaps the server using a new config that is uploaded with the request",
            serviceFile: "hotswap.js"
        }
    ]
};
let port = 1337;
let server = new Server();

describe( 'As a developer, I need to download files from the server.', function()
{
    before(() => {
    });
    beforeEach(( done ) => {
        server.init(port, config, () => {
            done();
        });
    });
    afterEach(( done ) => {
        server.stop(() => {
            done();
        });
    });
    after(() => {
    });
    it ( 'should hot-swap a new config', ( done ) => {
        let sourceFile = path.resolve('./test/e2e/endpoints', 'hotswap-config.json');
        let url = 'http://localhost:' + port + '/hotswap';
        let formData = { filename: fs.createReadStream( sourceFile )};
        request.post({ url: url, formData: formData }, (err, httpResponse, body) => {
            if (err) expect(true).to.be.equal(false);
            request('http://localhost:' + port + "/ping", { json: true }, (err, res, body) => {
                expect(res.statusCode).to.be.equal(200);
                request('http://localhost:' + port + "/microservices", { json: true }, (err, res, body) => {
                    expect(res.statusCode).to.be.equal(500);
                    done();
                });
            });
        });
    });
});
