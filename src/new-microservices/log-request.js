let Log = require('../util/log' );

class LogRequest {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let level = Log.getLevelFromString("DEBUG");
            let serviceData = ((params.serviceInfo && params.serviceInfo.serviceData && params.serviceInfo.serviceData)? params.serviceInfo && params.serviceInfo.serviceData && params.serviceInfo.serviceData : null );
            if (serviceData && serviceData.level) level = Log.getLevelFromString(serviceData.level);
            let body = params.body;
            if (body && serviceData && serviceData.json) body = Log.stringify(body);
            Log.log(level, "BODY: " + body);
            let files = params.files;
            if (files && serviceData && serviceData.json) files = Log.stringify(files);
            Log.log(level, "FILES: " + files);
            Log.log(level, "HEADERS: " + Log.stringify(params.headers));
            Log.log(level, "COOKIES: " + Log.stringify(params.cookies));
            inResolve && inResolve({ status: 200, send: 'Request information printed to log.' });
        });
    }
}
module.exports = LogRequest;
