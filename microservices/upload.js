'use strict';
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
UploadService.prototype.do = function ( req, res, next, serviceInfo )
{
    return new Promise (( inResolve, inReject ) => {
        const fileName = ((req.params.name)? req.params.name : "filename");
        const filePath = path.join(FILE_PATH, fileName);

        try {
            var fstream;
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldname, file, filename) {
                if ( files.existsSync( FILE_PATH + filename ) ) {
                    const error = {
                        title: fileName,
                        message: "Conflict: File Already Exists.",
                        error: {
                            status: 409
                        }
                    };
                    res.status(500);
                    res.render("error", error);
                    inReject && inReject ( error );
                    return;
                }
                fstream = fs.createWriteStream(FILE_PATH + filename);
                file.pipe(fstream);
                fstream.on('close', function () {
                    const message = {title: fileName, message: "Upload complete.", status: 200};
                    res.status(200);
                    res.render("message", message);
                    next();
                    inResolve && inResolve(message);
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
