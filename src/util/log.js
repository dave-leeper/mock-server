'use strict';

let log4js = require('log4js' ),
    os = require("os" ),
    process = require('process'),
    stringifyObject = require('stringify-object');

class Log {
    /**
     * Configures the logger.
     * @param {Object} inConfig - Logging configure. Follows standard log4js format.
     */
    static configure (inConfig ) {
        log4js.configure( inConfig );
    }
    static stringify(obj) { return stringifyObject(obj); }
    static get ALL() { return log4js.levels.ALL; }
    static get TRACE() { return log4js.levels.TRACE; }
    static get DEBUG() { return log4js.levels.DEBUG; }
    static get INFO() { return log4js.levels.INFO; }
    static get WARN() { return log4js.levels.WARN; }
    static get ERROR() { return log4js.levels.ERROR; }
    static get FATAL() { return log4js.levels.FATAL; }
    static get OFF() { return log4js.levels.OFF; }
    static set level( inLogLevel ) { log4js.getLogger().setLevel(inLogLevel); }
    static get level( ) { return log4js.getLogger().level; }
    static getLevelFromString ( inLogLevel ) {
        if (!inLogLevel) return Log.OFF;
        if ("ALL" === inLogLevel.toUpperCase()) return Log.ALL;
        if ("TRACE" === inLogLevel.toUpperCase()) return Log.TRACE;
        if ("DEBUG" === inLogLevel.toUpperCase()) return Log.DEBUG;
        if ("INFO" === inLogLevel.toUpperCase()) return Log.INFO;
        if ("WARN" === inLogLevel.toUpperCase()) return Log.WARN;
        if ("ERROR" === inLogLevel.toUpperCase()) return Log.ERROR;
        if ("FATAL" === inLogLevel.toUpperCase()) return Log.FATAL;
        return Log.OFF;
    }
    static will ( inLogLevel ) { return log4js.getLogger().isLevelEnabled ( inLogLevel ); }
    static log ( inLogLevel, inPayload ) {
        let strMachineId = os.hostname();
        let strProcessID = process.pid;
        let strHostname = os.hostname();
        let strLogMessage = ' | ' + strProcessID + ' | ' + strMachineId + ' | ' + strHostname + ' | ' + inPayload;

        log4js.getLogger().log ( inLogLevel, strLogMessage );
    }
    static all ( inPayload ) { this.log ( this.ALL, inPayload ); }
    static trace ( inPayload ) { this.log ( this.TRACE, inPayload ); }
    static debug ( inPayload ) { this.log ( this.DEBUG, inPayload ); }
    static info ( inPayload ) { this.log ( this.INFO, inPayload ); }
    static warn ( inPayload ) { this.log ( this.WARN, inPayload ); }
    static error ( inPayload ) { this.log ( this.ERROR, inPayload ); }
    static fatal ( inPayload ) { this.log ( this.FATAL, inPayload ); }
}
module.exports = Log;
