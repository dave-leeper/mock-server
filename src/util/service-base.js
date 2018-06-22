'use strict';

let Log = require ( './log.js' );

class ServiceBase {

    defaultResponse(req, res) {
        let originalURL = ((req && req.originalUrl) ? req.originalUrl : undefined);
        const error = {
            title: "Not Found",
            message: "File Not Found.",
            error: {status: 404},
            requestURL: originalURL
        };
        res.render('error', error);
    };

    addHeaders(configRecord, res) {
        if ((!configRecord.headers) || (!configRecord.headers.length)) return;
        for (let loop = 0; loop < configRecord.headers.length; loop++) {
            let header = configRecord.headers[loop];
            res.header(header.header, header.value);
        }
        Log.all('Added headers: ' + Log.stringify(configRecord.headers));
    }

    addCookies(configRecord, res) {
        if ((!configRecord.cookies) || (!configRecord.cookies.length)) return;
        for (let loop = 0; loop < configRecord.cookies.length; loop++) {
            let cookie = {name: configRecord.cookies[loop].name, value: configRecord.cookies[loop].value};
            let age = null;
            if (configRecord.cookies[loop].expires) {
                let offset = parseInt(configRecord.cookies[loop].expires);
                let expireTime = new Date(Number(new Date()) + offset);
                ;
                age = {expires: expireTime};
            } else if (configRecord.cookies[loop].maxAge) {
                age = {maxAge: parseInt(configRecord.cookies[loop].maxAge)};
            }
            if (!age) res.cookie(cookie.name, cookie.value);
            else res.cookie(cookie.name, cookie.value, age);
        }
        Log.all('Added cookies: ' + Log.stringify(configRecord.cookies));
    }

    sendErrorResponse(error, res, status) {
        res.status(((status) ? status : 500));
        res.render("error", error);
    }
}

module.exports = ServiceBase;
