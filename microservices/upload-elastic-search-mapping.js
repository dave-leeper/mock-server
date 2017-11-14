'use strict';

/**
 * @constructor
 */
function UploadElasticSearchMappingService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serviceInfo - Service config info.
 */
UploadElasticSearchMappingService.prototype.do = function ( req, res, serviceInfo )
{
    return new Promise (( inResolve, inReject ) => {

        try {
            let elasticSearchConnectionName = serviceInfo.databaseConnector;
            if (!elasticSearchConnectionName) {
                const error = { message: "Error connecting to database. No connection name found.", error: { status: 500, stack: err.stack} };
                res.render("error", error);
                inReject && inReject(error, null);
                return;
            }
            if ((!req.app)
            || (!req.app.locals)
            || (!req.app.locals.___extra)
            || (!req.app.locals.___extra.databaseConnectionManager))
            {
                const error = { message: "Error connecting to database. No database connection manager found.", error: { status: 500, stack: err.stack} };
                res.render("error", error);
                inReject && inReject(error, null);
                return;
            }
            let elasticSearchConnection = req.app.locals.___extra.databaseConnectionManager.getConnector( serviceInfo.databaseConnector );
            if (!elasticSearchConnection) {
                const error = { message: "Error connecting to database. No connection found.", error: { status: 500, stack: err.stack} };
                res.render("error", error);
                inReject && inReject(error, null);
                return;
            }

            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldname, file, filename) {
                elasticSearchConnection.createTable( file )
                    .then(() => {
                        const success = {status: "success", operation: "Create table"};
                        res.send(JSON.stringify(success));
                        inResolve && inResolve(null, success);
                    })
                    .catch(() => {
                        const error = { message: "Error creating table.", error: { status: 500, stack: err.stack}};
                        res.render("error", error);
                        inReject && inReject(error, null);
                    });
            });
        } catch (err) {
            const error = { message: "Error uploading ElasticSearch mapping file.", error: { status: 500, stack: err.stack} };
            res.render("error", error);
            inReject && inReject(error, null);
        }
    });
};

module.exports = UploadElasticSearchMappingService;
