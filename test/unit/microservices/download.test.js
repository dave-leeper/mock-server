//@formatter:off
'use strict';

let fs = require("fs");
let path = require("path");
let chai = require( 'chai' ),
    expect = chai.expect,
    request = require('request');
let Download = require('../../../src/microservices/download');

describe( 'As a developer, I need to download files from the server.', function()
{
    before(() => {
    });
    beforeEach(( ) => {
    });
    afterEach(( ) => {
    });
    after(() => {
    });
    it ( 'should download files from the server', ( done ) => {
        let download = new Download();
        let sourceFile = path.resolve('./public/files', 'filename');
        fs.writeFileSync(sourceFile, 'TEXT');
        download.do({ params: {name: 'filename' }}).then(( result ) => {
            expect( result.status ).to.be.equal( 200 );
            expect( result.fileDownloadPath ).to.be.equal( sourceFile );
            fs.unlinkSync(sourceFile);
            done();
        });
    });
    it ( 'should download files with a given name from the server', ( done ) => {
        let download = new Download();
        let sourceFile = path.resolve('./public/files', 'named_file');
        fs.writeFileSync(sourceFile, 'TEXT');
        download.do({ params: {name: 'named_file' }}).then(( result ) => {
            expect( result.status ).to.be.equal( 200 );
            expect( result.fileDownloadPath ).to.be.equal( sourceFile );
            fs.unlinkSync(sourceFile);
            done();
       });
    });
    it ( 'should fail gracefully when a file does not exist on the server', ( done ) => {
        let download = new Download();
        download.do({ params: {name: 'JUNK' }}).then(( result ) => {
        }, (error) => {
            expect(error.status).to.be.equal(404);
            expect(error.viewName).to.be.equal('error');
            done();
        });
    });
});
