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
    return new Promise (( inResolve ) => {
        const fileName = ((req.params.name)? req.params.name : "filename");
        const filePath = path.join(FILE_PATH, fileName);

        try {
            var fstream;
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldname, file, filename) {
                if ( files.existsSync( FILE_PATH + filename ) ) {
                    res.render("already-exists", { title: fileName });
                    inResolve && inResolve ( null, this );
                    return;
                }
                fstream = fs.createWriteStream(FILE_PATH + filename);
                file.pipe(fstream);
                fstream.on('close', function () {
                    res.render("upload-complete", {title: fileName});
                    inResolve && inResolve(null, this);
                });
            });
        } catch (err) {
            res.render("error", { message: "Error uploading file.", error: { status: 500, stack: err.stack} });
            inResolve && inResolve(null, this);
        }
    });
};

module.exports = UploadService;
