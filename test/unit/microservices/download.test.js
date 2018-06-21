//@formatter:off
'use strict';

let fs = require("fs");
let path = require("path");
let chai = require( 'chai' ),
    expect = chai.expect,
    Server = require('../../../server.js'),
    request = require('request');
let config = {
    microservices: [
        {
            path: "/test_download",
            name: "Test Download",
            description: "Tests the file download microservice.",
            serviceFile: "download.js"
        },
        {
            path: "/test_download_with_name/:name",
            name: "Test Upload",
            description: "Tests the file upload microservice.",
            serviceFile: "download.js"
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
    it ( 'should download files from the server', ( done ) => {
        let sourceFile = path.resolve('./public/files', 'filename');
        let url = 'http://localhost:' + port + '/test_download';
        fs.writeFileSync(sourceFile, 'TEXT');
        request(url, (err, res, body) => {
            if (err) expect(true).to.be.equal(false);
            expect(body).to.be.equal('TEXT');
            fs.unlinkSync(sourceFile);
            done();
        });
    });
    it ( 'should download files with a given name from the server', ( done ) => {
        let sourceFile = path.resolve('./public/files', 'named_file');
        let url = 'http://localhost:' + port + '/test_download_with_name/named_file';
        fs.writeFileSync(sourceFile, 'TEXT');
        request(url, (err, res, body) => {
            if (err) expect(true).to.be.equal(false);
            expect(body).to.be.equal('TEXT');
            fs.unlinkSync(sourceFile);
            done();
        });
    });
    it ( 'should fail gracefully when a file does not exist on the server', ( done ) => {
        let url = 'http://localhost:' + port + '/test_download_with_name/JUNK';
        request(url, (err, res, body) => {
            if (err) expect(true).to.be.equal(false);
            expect(res.statusCode).to.be.equal(404);
            done();
        });
    });
});
