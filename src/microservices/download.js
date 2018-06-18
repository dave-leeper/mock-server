let Log = require('../util/log' );

class Download {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            const FILE_PATH = path.join(__dirname , "/../files/");
            const fileName = ((params.params.name) ? params.params.name : "filename");
            const filePath = path.join(FILE_PATH, fileName);
            if (!files.existsSync(filePath)) {
                let error = 'File (' + filePath + ') Not Found.';
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
            }
            inResolve && inResolve({status: 200, fileDownloadPath: filePath});
        });
    }
}
module.exports = Download;
