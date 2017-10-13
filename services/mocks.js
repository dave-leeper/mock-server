'use strict'

var log = require ( '../util/logger-utilities.js' );

const   strModuleName = "MocksService",
    strModuleEnter = ">" + strModuleName,
    strModuleExit = "<" + strModuleName,
    strModuleEnterRespond = strModuleEnter + ".respond",
    strModuleExitRespond = strModuleExit + ".respond";

/**
 * @constructor
 */
function MocksService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serverInfo - Server config info.
 * @param serviceInfo - Service config info.
 */
MocksService.prototype.respond = function ( req, res, serverInfo, serviceInfo )
{
    return new Promise (( inResolve ) => {
        if ( log.will( log.ALL )) log.all( strModuleEnterRespond );
        if ((serverInfo) && (serverInfo.mocks) && (serverInfo.mocks.length)) {
            var result = [];

            for (var loop = 0; loop < serverInfo.mocks.length; loop++) {
                var mock = serverInfo.mocks[loop];

                result.push({
                    "path": mock.path,
                    "responseFile": mock.responseFile,
                    "fileType": mock.fileType
                });
            }
            res.send(JSON.stringify(result));
        } else {
            res.send(JSON.stringify({"response": "No registered mock services"}));
        }
        inResolve && inResolve ( null, this );
        if ( log.will( log.ALL )) log.all( strModuleExitRespond );
    });
};

module.exports = MocksService;
