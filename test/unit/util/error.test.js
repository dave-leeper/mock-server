//@formatter:off
'use strict';
let chai = require( 'chai' ),
    expect = chai.expect;
let I18n = require('../../../src/util/i18n' );
let Error = require('../../../src/util/error' );
let Errors = require('../../../src/util/errors' );
let Strings = require('../../../src/util/strings' );

describe( 'As a developer, I need to generate errors', function() {
    before(() => {
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    after(() => {
    });
    it ( 'should get errors.', (  ) => {
        let error = Error.get(Errors.FILE_ALREADY_EXISTS);
        let title = I18n.get(Strings.ERROR_MESSAGE_FILE_NAME);
        let message = I18n.get(Strings.ERROR_MESSAGE_FILE_ALREADY_EXISTS);
        expect(error.title).to.be.equal(title);
        expect(error.message).to.be.equal(message);
    });
    it ( 'should format error strings.', (  ) => {
        let fileName = 'file name';
        let error = Error.get(Errors.FILE_ALREADY_EXISTS, fileName, fileName, { stack: 'STACK' });
        let title = I18n.format(I18n.get(Strings.ERROR_MESSAGE_FILE_NAME), fileName);
        let message = I18n.format(I18n.get(Strings.ERROR_MESSAGE_FILE_ALREADY_EXISTS), fileName);
        // console.log('error='+JSON.stringify(error));
        // console.log('Strings.ERROR_MESSAGE_FILE_NAME='+I18n.get(Strings.ERROR_MESSAGE_FILE_NAME));
        // console.log('title='+title);
        expect(error.title).to.be.equal(title);
        expect(error.message).to.be.equal(message);
        expect(error.error.stack).to.be.equal('STACK');
    });
});

