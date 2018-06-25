'use strict';

const Registry = require ( './registry.js' );
const Strings = require ( './strings.js' );
const I18n = require ( './i18n.js' );
const Log = require ( './log.js' );
const uuidv4 = require('uuid/v4');

class ServiceBase {
    notFoundResponse(req, res) {
        let originalURL = ((req && req.originalUrl) ? req.originalUrl : undefined);
        const error = {
            title: "Not Found",
            message: "File Not Found.",
            error: {status: 404},
            requestURL: originalURL
        };
        res && res.render('error', error);
    };

    addHeaders(configInfo, req, res) {
        if ((configInfo) && (configInfo.headers) && (configInfo.headers.length)) {
            for (let loop = 0; loop < configInfo.headers.length; loop++) {
                let header = configInfo.headers[loop];
                res.header(header.header, header.value);
            }
            Log.all('Added headers: ' + Log.stringify(configInfo.headers));
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
        let createCookie = (cookieInfo) => {
            let cookie = {name: cookieInfo.name, value: cookieInfo.value};
            let age = null;
            if (cookieInfo.expires) {
                let offset = parseInt(cookieInfo.expires);
                let expireTime = new Date(Number(new Date()) + offset);
                age = {expires: expireTime};
            } else if (cookieInfo.maxAge) {
                age = {maxAge: parseInt(cookieInfo.maxAge)};
            }
            if (!age) res.cookie(cookie.name, cookie.value);
            else res.cookie(cookie.name, cookie.value, age);
        };
        if ((configRecord) && (configRecord.cookies) && (configRecord.cookies.length)) {
            for (let loop = 0; loop < configRecord.cookies.length; loop++) {
                createCookie(configRecord.cookies[loop]);
            }
            Log.all('Added cookies: ' + Log.stringify(configRecord.cookies));
        }
        if (!req || !req.user || !req.user.username) return;
        let cookies = Registry.get('Cookies');
        if (!cookies || ! cookies.users) return;
        let userCookies = cookies.users[req.user.username];
        if (!userCookies) return;
        for (let loop = 0; loop < userCookies.length; loop++) {
            createCookie(userCookies[loop]);
        }
        Log.all('Added cookies for user: ' + req.user.username);
    }

    sendErrorResponse(error, res, status) {
        res && res.status(((status) ? status : 500));
        res && res.render('error', error);
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
        if (!authorizationStrategy || !authorizationStrategy.strategy || !authorizationStrategy.strategy.getAuthorization) {
            Log.error( I18n.get( Strings.AUTHORIZATION_NOT_CONFIGURED ));
            return null;
        }
        return authorizationStrategy.strategy.getAuthorization();
    }
}

module.exports = ServiceBase;
