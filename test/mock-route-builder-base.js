'use strict';

class MockRouteBuilderBase {
    constructor() {
        this.req = null;
        this.res = null;
        this.configRecord = null;
        this.err = null;
        this.status = null;
    }
    defaultResponse(req, res) {
        this.req = req;
        this.res = res;
    };
    addHeaders(configRecord, res) {
        this.configRecord = configRecord;
        this.res = res;
    }
    addCookies(configRecord, res) {
        this.configRecord = configRecord;
        this.res = res;
    }
    sendErrorResponse(error, res, status) {
        this.err = error;
        this.res = res;
        this.status = status;
    }
}

module.exports = MockRouteBuilderBase;
