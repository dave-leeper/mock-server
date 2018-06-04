//@formatter:off
'use strict';
let Log = require('../../../src/util/log' );
const recording = require('log4js/lib/appenders/recording');
let chai = require( 'chai' ),
    expect = chai.expect;
let config = {
    appenders: {
        mem: { type: "recording" },
        out: { type: "stdout" }
    },
    categories: {
        default:{
            appenders: ["mem", "out"],
            level : "trace"
        }
    }
};

describe( 'As a developer, I need to be able to log information.', function() {
    it ( 'should accept config info', ( ) => {
        try { Log.configure(config); }
        catch (error) { expect(true).to.be.equal(false); }
    });
    it ( 'should log data', ( ) => {
        Log.configure(config);
        Log.info("TEST DATA");
        const events = recording.replay(); // events is an array of LogEvent objects.
        expect(events).not.to.be.null;
        expect(events.length).to.be.equal(1);
        expect(events[0].categoryName).to.be.equal('default');
        expect(events[0].data).not.to.be.null;
        expect(events[0].data.length).to.be.equal(1);
        expect(events[0].data[0].indexOf("TEST DATA")).not.to.be.equal(-1);
    });
});
