let Log = require('../util/log' );
let path = require('path');
let files = require ( '../util/files.js' );

const FILE_PATH = path.resolve('./public/files');
class Download {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            const fileName = (((params) && (params.params) &&(params.params.name)) ? params.params.name : "filename");
            const filePath = path.join(FILE_PATH, fileName);
            if (!files.existsSync(filePath)) {
                let error = 'File (' + fileName + ') not found.';
                Log.error(Log.stringify(error));
                inReject && inReject({
                    status: 404,
                    send: error,
                    viewName: 'error',
                    viewObject: {
                        title: fileName,
                        message: error,
                        error: {status: 404}
                    },
                });
                return;
            }
            inResolve && inResolve({status: 200, fileDownloadPath: filePath});
        });
    }
}
module.exports = Download;
