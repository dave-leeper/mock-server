'use strict';

/**
 * @constructor
 */
function MocksMicroservice ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serviceInfo - Service config info.
 */
MocksMicroservice.prototype.do = function (req, res, next, serviceInfo )
{
    return new Promise (( inResolve, inReject ) => {
        if ((req)
        && (req.app)
        && (req.app.locals)
        && (req.app.locals.___extra)
        && (req.app.locals.___extra.serverConfig)
        && (req.app.locals.___extra.serverConfig.mocks)
        && (req.app.locals.___extra.serverConfig.mocks.length)) {
            let result = [];
            let mocks = req.app.locals.___extra.serverConfig.mocks;

            for (let loop = 0; loop < mocks.length; loop++) {
                let mock = mocks[loop];

                result.push({
                    "path": mock.path,
                    "response": mock.response,
                    "responseType": mock.responseType
                });
            }
            res.status(200);
            res.send(JSON.stringify(result));
            next();
        } else {
            res.status(200);
            res.send(JSON.stringify({"response": "No registered mocks"}));
        }
        inResolve && inResolve ( this );
    });
};

module.exports = MocksMicroservice;
