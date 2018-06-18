'use strict';

let validateParams = (builder, req, res) => {
    if (!req.params.index) {
        const error = { message: "Error, no index name provided.", error: { status: 500 }};
        builder.sendErrorResponse(error, res);
        return false;
    }
    if (!req.params.type) {
        const error = { message: "Error, no data type provided.", error: { status: 500 }};
        builder.sendErrorResponse(error, res);
        return false;
    }
    if (!req.params.id) {
        const error = { message: "Error, no record id provided.", error: { status: 500 }};
        builder.sendErrorResponse(error, res);
        return false;
    }
    return true;
};

module.exports = validateParams;
