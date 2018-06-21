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
            verb: "POST",
            path: "/test_upload",
            name: "Test Upload",
            description: "Tests the file upload microservice.",
            serviceFile: "upload.js"
        },
        {
            verb: "POST",
            path: "/test_upload_with_name/:name",
            name: "Test Upload",
            description: "Tests the file upload microservice.",
            serviceFile: "upload.js"
        }
    ]
};
let port = 1337;
let server = new Server();

describe( 'As a developer, I need to upload files to the server.', function()
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
    it ( 'should upload files', ( done ) => {
        let sourceFile = path.resolve('./public/files', 'user2.png');
        let destFile = path.resolve('./public/files', 'filename');
        let url = 'http://localhost:' + port + '/test_upload';
        let formData = { filename: fs.createReadStream( sourceFile )};
        request.post({ url: url, formData: formData }, (err, httpResponse, body) => {
            if (err) expect(true).to.be.equal(false);
            expect(fs.existsSync(destFile)).to.be.equal(true);
            fs.unlinkSync(destFile);
            done();
        });
    });
    it ( 'should upload files using a given name', ( done ) => {
        let sourceFile = path.resolve('./public/files', 'user2.png');
        let destFile = path.resolve('./public/files', 'named_file');
        let url = 'http://localhost:' + port + '/test_upload_with_name/named_file';
        let formData = { filename: fs.createReadStream( sourceFile )};
        request.post({ url: url, formData: formData }, (err, httpResponse, body) => {
            if (err) expect(true).to.be.equal(false);
            expect(fs.existsSync(destFile)).to.be.equal(true);
            fs.unlinkSync(destFile);
            done();
        });
    });
    it ( 'should not upload files that are already on the server', ( done ) => {
        let sourceFile = path.resolve('./public/files', 'user2.png');
        let destFile = path.resolve('./public/files', 'named_file');
        let url = 'http://localhost:' + port + '/test_upload_with_name/named_file';
        let formData = { filename: fs.createReadStream( sourceFile )};
        fs.writeFileSync(destFile, 'TEXT');
        request.post({ url: url, formData: formData }, (err, httpResponse, body) => {
            if (err) expect(true).to.be.equal(false);
            expect(httpResponse.statusCode).to.be.equal(409);
            fs.unlinkSync(destFile);
            done();
        });
    });
});
