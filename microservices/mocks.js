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
    return new Promise (( inResolve ) => {
        if ((router)
        && (router.server)
        && (router.server.serverConfig)
        && (router.server.serverConfig.services)
        && (router.server.serverConfig.services.length)) {
            let result = [];
            let mocks = router.server.serverConfig.mocks;

            for (let loop = 0; loop < mocks.length; loop++) {
                let mock = mocks[loop];

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
