'use strict'

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
 * @param router - The router.
 * @param serviceInfo - Service config info.
 */
DownloadService.prototype.do = function ( req, res, router, serviceInfo )
{
    return new Promise (( inResolve ) => {
        const fileName = ((req.params.name)? req.params.name : "filename");
        const filePath = path.join(FILE_PATH, fileName);

        if ( !files.existsSync( filePath ) ) {
            res.render("not-found", { title: fileName });
            inResolve && inResolve ( null, this );
        } else {
            res.download(filePath);

            inResolve && inResolve(null, this);
        }
    });
};

module.exports = DownloadService;
