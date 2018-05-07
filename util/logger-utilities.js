'use strict';

let log4js = require('log4js' ),
    os = require("os" ),
    process = require('process');

class LoggerUtilities
{

    /**
     * Configures the logger.
     * @param {Object} inConfig - Logging config. Follows standard log4js format.
     */
    static config ( inConfig )
    {
        log4js.configure( inConfig );
    }

    /**
     * Formats a string in a manner similar to sprintf or Microsoft's String.Format() method.
     *
     * @example
     * format('{0} is not {1}! {0} {2}', 'Sale', 'Sail');
     * results in:
     * Sale is not Sail! Sale {2}
     * @param inFormat {String} The format string.
     * @Param ... {String} ALL comma separated list of string parameters used to format the inFormat string.
     * @returns {String} The formatted string.
     */
    static format ( inFormat )
    {
        var aArgs = Array.prototype.slice.call ( arguments, 1 );

        return inFormat.replace
        (
            /{(\d+)}/g,
            function ( inMatch, inNumber )
            {
                return typeof aArgs[ inNumber ] !== 'undefined' ? aArgs[ inNumber ] : inMatch;
            }
        );
    }

    /**
     * Shortcuts for the various log levels.
     */
    static get ALL() { return log4js.levels.ALL; }
    static get TRACE() { return log4js.levels.TRACE; }
    static get DEBUG() { return log4js.levels.DEBUG; }
    static get INFO() { return log4js.levels.INFO; }
    static get WARN() { return log4js.levels.WARN; }
    static get ERROR() { return log4js.levels.ERROR; }
    static get FATAL() { return log4js.levels.FATAL; }
    static get OFF() { return log4js.levels.OFF; }

    /**
     */
    constructor( )
    {
    }

    /**
     * Sets the log level to use.
     * @param {Level} inLogLevel - The log level to use.
     */
    static set level( inLogLevel )
    {
        log4js.getLogger().setLevel(inLogLevel);
    }

    /**
     * Gets the log level to use.
     * @return {Level} The log level to use.
     */
    static get level(  )
    {
        return log4js.getLogger().level;
    }

    /**
     * Returns true if the logger will log a message at the current log level.
     * @param {Level} inLogLevel - The log level to check.
     * @return {Boolean} True if the logger is currently logging messages with the given log level, false otherwise.
     */
    static will ( inLogLevel )
    {
        return log4js.getLogger().isLevelEnabled ( inLogLevel );
    }

    /**
     * Logs a message using P3 standards.
     * @param {Level} inLogLevel - The log level to use.
     * @param {String} inPayload - The message to log.
     */
    static log ( inLogLevel, inPayload )
    {
        var strMachineId = os.hostname();
        var strProcessID = process.pid;
        var strHostname = os.hostname();
        var strLogMessage = ' | ' + strProcessID + ' | ' + strMachineId + ' | ' + strHostname + ' | ' + inPayload;

        log4js.getLogger().log ( inLogLevel, strLogMessage );
    }

    /**
     * Logs a message using P3 standards.
     * @param {String} inPayload - The message to log.
     */
    static all ( inPayload )
    {
        this.log ( this.ALL, inPayload );
    }

    /**
     * Logs a message using P3 standards.
     * @param {String} inPayload - The message to log.
     */
    static trace ( inPayload, inStatus, inSessionID )
    {
        this.log ( this.TRACE, inPayload );
    }

    /**
     * Logs a message using P3 standards.
     * @param {String} inPayload - The message to log.
     */
    static debug ( inPayload )
    {
        this.log ( this.DEBUG, inPayload );
    }

    /**
     * Logs a message using P3 standards.
     * @param {String} inPayload - The message to log.
     */
    static info ( inPayload )
    {
        this.log ( this.INFO, inPayload );
    }

    /**
     * Logs a message using P3 standards.
     * @param {String} inPayload - The message to log.
     */
    static warn ( inPayload )
    {
        this.log ( this.WARN, inPayload );
    }

    /**
     * Logs a message using P3 standards.
     * @param {String} inPayload - The message to log.
     */
    static error ( inPayload )
    {
        this.log ( this.ERROR, inPayload );
    }

    /**
     * Logs a message using P3 standards.
     * @param {String} inPayload - The message to log.
     */
    static fatal ( inPayload )
    {
        this.log ( this.FATAL, inPayload );
    }
}

module.exports = LoggerUtilities;
