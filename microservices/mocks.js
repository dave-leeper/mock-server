'use strict'

/**
 * @constructor
 */
function MocksMicroservice ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param router - The router.
 * @param serviceInfo - Service config info.
 */
MocksMicroservice.prototype.do = function (req, res, router, serviceInfo )
{
    console.log(JSON.stringify(router));
    return new Promise (( inResolve ) => {
        if ((router) && (router.serverConfig) && (router.serverConfig.mocks) && (router.serverConfig.mocks.length)) {
            var result = [];

            for (var loop = 0; loop < router.serverConfig.mocks.length; loop++) {
                var mock = router.serverConfig.mocks[loop];

                result.push({
                    "path": mock.path,
                    "responseFile": mock.responseFile,
                    "fileType": mock.fileType
                });
            }
            res.send(JSON.stringify(result));
        } else {
            res.send(JSON.stringify({"response": "No registered mock microservices"}));
        }
        inResolve && inResolve ( null, this );
    });
};

module.exports = MocksMicroservice;
