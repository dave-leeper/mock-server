//@formatter:off
'use strict';
let chai = require( 'chai' ),
    expect = chai.expect;
let Files = require('../../../src/util/files' );

describe( 'As a developer, I need to be able to work with files.', function() {
    before(() => {
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    after(() => {
    });
    it ( 'should be able to determine if a file exists', ( ) => {
        expect(Files.existsSync('./test/data/test-data.json')).to.be.equal(true);
        expect(Files.existsSync('./test/data/JUNK')).to.be.equal(false);
    });
    it ( 'should be able to read files synchronously', ( ) => {
        const expectedData = '{ "name": "My Server", "version": "1.0" }';
        let data = Files.readFileSync('./test/data/test-data.json');
        expect(data).to.be.equal(expectedData);
    });
    it ( 'should be able to write files synchronously', ( ) => {
        expect(Files.existsSync('./test/data/temp-test-file')).to.be.equal(false);
        Files.writeFileSync('./test/data/temp-test-file', "TEMP");
        expect(Files.existsSync('./test/data/temp-test-file')).to.be.equal(true);
        let data = Files.readFileSync('./test/data/temp-test-file');
        expect(data).to.be.equal("TEMP");
    });
    it ( 'should be able to delete files synchronously', ( ) => {
        expect(Files.existsSync('./test/data/temp-test-file')).to.be.equal(true);
        Files.deleteSync('./test/data/temp-test-file');
        expect(Files.existsSync('./test/data/temp-test-file')).to.be.equal(false);
    });
    it ( 'should be able to lock a file and read it synchronously', ( ) => {
        const expectedData = '{ "name": "My Server", "version": "1.0" }';
        let success = ( data ) => { expect(data).to.be.equal(expectedData); };
        let fail = ( err ) => { expect(true).to.be.equal(false); };
        let data = Files.readFileLock('./test/data/test-data.json', 5, success, fail);
    });
    it ( 'should be able to lock a file and read it synchronously', ( ) => {
        let success = ( ) => {
            expect(Files.existsSync('./test/data/temp-test-file')).to.be.equal(true);
            let data = Files.readFileSync('./test/data/temp-test-file');
            Files.deleteSync('./test/data/temp-test-file');
            expect(data).to.be.equal("TEMP");
        };
        let fail = ( err ) => { expect(true).to.be.equal(false); };

        expect(Files.existsSync('./test/data/temp-test-file')).to.be.equal(false);
        Files.writeFileLock('./test/data/temp-test-file', "TEMP", 5, success, fail);
    });
});
