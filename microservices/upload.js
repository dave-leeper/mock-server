'use strict';

const path = require('path');
let fs = require('fs-extra');
let files = require ( '../util/file-utilities.js' );

const FILE_PATH = path.join(__dirname , "/../files/");
/**
 * @constructor
 */
function UploadService ( )
{
}

/**
 * @param req {Object} - The request object.
 * @param res {Object} - The response object.
 * @param serviceInfo - Service config info.
 */
UploadService.prototype.do = function ( req, res, serviceInfo )
{
    return new Promise (( inResolve, inReject ) => {
        const fileName = ((req.params.name)? req.params.name : "filename");
        const filePath = path.join(FILE_PATH, fileName);

        try {
            var fstream;
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldname, file, filename) {
                if ( files.existsSync( FILE_PATH + filename ) ) {
                    const error = { title: fileName };
                    res.status(500);
                    res.render("already-exists", error);
                    inReject && inReject ( error, null );
                    return;
                }
                fstream = fs.createWriteStream(FILE_PATH + filename);
                file.pipe(fstream);
                fstream.on('close', function () {
                    const success = {title: fileName};
                    res.status(200);
                    res.render("upload-complete", success);
                    inResolve && inResolve(null, success);
                });
            });
        } catch (err) {
            const error = { message: "Error uploading file.", error: { status: 500, stack: err.stack} };
            res.status(500);
            res.render("error", error);
            inReject && inReject(error, null);
        }
    });
};

module.exports = UploadService;
