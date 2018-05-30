let path = require('path');
let fs = require('fs-extra');
let files = require ( '../util/file-utilities.js' );

class Upload {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            const FILE_PATH = path.join(__dirname , "/../files/");
            const fileName = ((params.params.name)? params.params.name : "filename");
            try {
                let fstream;
                params.pipe(params.busboy);
                params.busboy.on('file', function (fieldname, file, filename) {
                    if ( files.existsSync( path.join(Upload.FILE_PATH, fileName) ) ) {
                        const error = {
                            title: fileName,
                            message: "Conflict: File Already Exists.",
                            error: { status: 409 }
                        };
                        inReject && inReject ({
                            status: 409,
                            viewName: 'error',
                            viewObject: error,
                        });
                        return;
                    }
                    fstream = fs.createWriteStream(Upload.FILE_PATH + filename);
                    file.pipe(fstream);
                    fstream.on('close', function () {
                        inResolve && inResolve({
                            status: 200,
                            viewName: 'message',
                            viewObject: {title: fileName, message: "Upload complete.", status: 200},
                        });
                    });
                });
            } catch (err) {
                const error = { message: "Error uploading file.", error: { status: 500, stack: err.stack} };
                inReject && inReject ({
                    status: 500,
                    viewName: 'error',
                    viewObject: error,
                });
            }
        });
    }
}
module.exports = Upload;
