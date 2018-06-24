'use strict';

const Registry = require ( './registry.js' );
const Strings = require ( './strings.js' );
const I18n = require ( './i18n.js' );
const Log = require ( './log.js' );
const uuidv4 = require('uuid/v4');

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

    addHeaders(configRecord, req, res) {
        if ((configRecord.headers) && (configRecord.headers.length)) {
            for (let loop = 0; loop < configRecord.headers.length; loop++) {
                let header = configRecord.headers[loop];
                res.header(header.header, header.value);
            }
            Log.all('Added headers: ' + Log.stringify(configRecord.headers));
        }
        if (!req || !req.user || !req.user.username) return;
        let headers = Registry.get('Headers');
        if (!headers || !headers.users) return;
        let userHeaders = headers.users[req.user.username];
        if (!userHeaders) return;
        for (let loop = 0; loop < userHeaders.length; loop++) {
            let header = userHeaders[loop];
            if ('Authorization' === header.header) header.value = 'MOCK-SERVER token="' + uuidv4() + '"';
            res.header(header.header, header.value);
        }
        Log.all('Added headers for user: ' + req.user.username);
    }

    addCookies(configRecord, req, res) {
        if ((configRecord.cookies) && (configRecord.cookies.length)) {
            for (let loop = 0; loop < configRecord.cookies.length; loop++) {
                let cookie = {name: configRecord.cookies[loop].name, value: configRecord.cookies[loop].value};
                let age = null;
                if (configRecord.cookies[loop].expires) {
                    let offset = parseInt(configRecord.cookies[loop].expires);
                    let expireTime = new Date(Number(new Date()) + offset);
                    age = {expires: expireTime};
                } else if (configRecord.cookies[loop].maxAge) {
                    age = {maxAge: parseInt(configRecord.cookies[loop].maxAge)};
                }
                if (!age) res.cookie(cookie.name, cookie.value);
                else res.cookie(cookie.name, cookie.value, age);
            }
            Log.all('Added cookies: ' + Log.stringify(configRecord.cookies));
        }
        if (!req || !req.user || !req.user.username) return;
        let cookies = Registry.get('Cookies');
        if (!cookies || ! cookies.users) return;
        let userCookies = cookies.users[req.user.username];
        if (!userCookies) return;
        for (let loop = 0; loop < userCookies.length; loop++) {
            let cookie = userCookies[loop];
            let age = null;
            if (cookie.expires) {
                let offset = parseInt(cookie.expires);
                let expireTime = new Date(Number(new Date()) + offset);
                age = {expires: expireTime};
            } else if (cookie.maxAge) {
                age = {maxAge: parseInt(cookie.maxAge)};
            }
            if (!age) res.cookie(cookie.name, cookie.value);
            else res.cookie(cookie.name, cookie.value, age);
        }
        Log.all('Added cookies for user: ' + req.user.username);
    }

    sendErrorResponse(error, res, status) {
        res.status(((status) ? status : 500));
        res.render("error", error);
    }

    authentication(authenticationStrategies, authenticationName) {
        if (!authenticationStrategies || !authenticationName) return null;
        let passport = Registry.get('Passport');
        let authenticationStrategy = authenticationStrategies[authenticationName];
        if (!passport || !authenticationStrategy) {
            Log.error( I18n.get( Strings.AUTHENTICATION_NOT_CONFIGURED ));
            return null;
        }
        let strategyHandler;
        if (!authenticationStrategy.config) strategyHandler = passport.authenticate( authenticationStrategy.name );
        else strategyHandler = passport.authenticate( authenticationStrategy.name, authenticationStrategy.config )
        return strategyHandler;
    }

    authorization(authorizationStrategies, authorizationInfo) {
        if (!authorizationStrategies || !authorizationInfo || !authorizationInfo.strategy) return null;
        let authorizationStrategy = authorizationStrategies[authorizationInfo.strategy];
        if (!authorizationStrategy) {
            Log.error( I18n.get( Strings.AUTHORIZATION_NOT_CONFIGURED ));
            return null;
        }
        return authorizationStrategy.strategy.getAuthorization();
    }
}

module.exports = ServiceBase;
