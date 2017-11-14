'use strict';

const path = require('path');
let files = require ( '../util/file-utilities.js' );

const FILE_PATH = path.join(__dirname , "/../files/");
/**
 * @constructor
 */
function DownloadService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serviceInfo - Service config info.
 */
DownloadService.prototype.do = function ( req, res, serviceInfo )
{
    return new Promise (( inResolve, inReject ) => {
        const fileName = ((req.params.name)? req.params.name : "filename");
        const filePath = path.join(FILE_PATH, fileName);

        if ( !files.existsSync( filePath ) ) {
            const error = { title: fileName };
            res.render("not-found", error);
            inReject && inReject ( error, null );
        } else {
            const success = { status: "success", operation: "File download" };
            res.download(filePath);

            inResolve && inResolve(null, success);
        }
    });
};

module.exports = DownloadService;
