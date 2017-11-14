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
    return new Promise (( inResolve ) => {

        try {
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldname, file, filename) {

            });
        } catch (err) {
            res.render("error", { message: "Error uploading ElasticSearch mapping file.", error: { status: 500, stack: err.stack} });
            inResolve && inResolve(null, this);
        }
    });
};

module.exports = UploadElasticSearchMappingService;
