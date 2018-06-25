//@formatter:off
'use strict';
let chai = require( 'chai' ),
    expect = chai.expect;
let Strings = require('../../../src/util/strings' );
let strings_en_US = require('../../../src/util/strings-en-US' );

describe( 'As a developer, I need to work with predefined strings, possibly in multiple languages', function() {
    before(() => {
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    after(() => {
    });
    it ( 'should define all strings for all supported languages', (  ) => {
        expect(strings_en_US.length).to.be.equal(Strings.COUNT);
    });
});

