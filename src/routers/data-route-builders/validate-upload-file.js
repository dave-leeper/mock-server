'use strict';

let validateUploadFile = (builder, req, res) => {
    if ((!req.files)
    || (!req.files.fileUploaded)
    || (!req.files.fileUploaded.data)) {
        const error = { message: "Error, no mapping file was uploaded.", error: { status: 500 }};
        builder.sendErrorResponse(error, res);
        return false;
    }
    return true;
};

module.exports = validateUploadFile;
