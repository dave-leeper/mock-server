const PassportLocalStrategy = require('passport-local').Strategy;
const Registry = require('../util/registry' );
const Strings = require('../util/strings' );
const I18n = require('../util/i18n' );
const Log = require('../util/log' );
const accounts = require('./authentication').accounts;

class LocalStrategy {
    constructor() {
        this.accounts = accounts;
    }
    getAuthentication() {
        return new PassportLocalStrategy((username, password, done) => {
            let operation = 'getAuthentication';
            if (!username || !password || !done) {
                const err = { operation: operation, statusType: 'error', status: 401, message: I18n.get( Strings.LOGIN_REQUIRED )};
                Log.error(Log.stringify(err));
                return done && done(err);
            }
            if (!this.accounts) {
                const err = { operation: operation, statusType: 'error', status: 501, message: I18n.get( Strings.AUTHENTICATION_NOT_CONFIGURED )};
                Log.error(Log.stringify(err));
                return done(err);
            }
            for (let loop = 0; loop < this.accounts.length; loop++) {
                let account = this.accounts[loop];
                if (account.username !== username) continue;
                if (account.password !== password) {
                    return done( null, false, { operation: operation, statusType: 'error', status: 401, message: I18n.get( Strings.INCORRECT_PASSWORD )});
                }
                let headers = Registry.get('Headers');
                if (!headers.users) headers.users = {};
                if (!headers.users[account.username]) headers.users[account.username] = [];
                if (account.headers && 0 != account.headers.length) {
                    headers.users[account.username] = headers.users[account.username].concat(account.headers);
                }
                headers.users[account.username].push({ "header": "Authorization", "value": "?" });
                if (account.cookies && 0 != account.cookies.length) {
                    let cookies = Registry.get('Cookies');
                    if (!cookies.users) cookies.users = {};
                    if (!cookies.users[account.username]) cookies.users[account.username] = [];
                    cookies.users[account.username] = cookies.users[account.username].concat(account.cookies);
                }
                return done(null, { operation: operation, statusType: 'success', status: 200, username: account.username, message: I18n.get( Strings.LOGIN_SUCCESSFUL )});
            }
            return done( null, false, { operation: operation, statusType: 'error', status: 401, message: I18n.format( I18n.get( Strings.INCORRECT_USER_NAME ), username )});
        });
    }
    getAuthorization() {
        return (req, res, next) => {
            let operation = 'getAuthorization';
            let config = Registry.get('ServerConfig');
            if ((!this.accounts)
            || (!req || !req.url)
            || (!config)) {
                const err = { operation: operation, statusType: 'error', status: 501, message: I18n.get( Strings.AUTHORIZATION_NOT_CONFIGURED )};
                Log.error(Log.stringify(err));
                res.status(err.status);
                res.send(Log.stringify(err))
                return;
            }
            if (!req || !req.user || !req.user.username){
                const err = { operation: operation, statusType: 'error', status: 401, message: I18n.get( Strings.LOGIN_REQUIRED )};
                Log.error(Log.stringify(err));
                res.status(err.status);
                res.send(Log.stringify(err))
                return;
            }

            let reduce = (accumulator, currentValue) => {
                if (accumulator) return accumulator;
                return currentValue;
            };
            let username = req.user.username;
            let account = this.accounts.map(account => (account.username === username? account : null )).reduce(reduce);
            if (!account) {
                const err = { operation: operation, statusType: 'error', status: 401, message: I18n.format( I18n.get( Strings.INCORRECT_USER_NAME ), username )};
                Log.error(Log.stringify(err));
                res.status(err.status);
                res.send(Log.stringify(err))
                return;
            }
            let url = req.url;
            let verb = req.header('Request Method');
            let map = ( configInfo ) => {
                if (!configInfo.authorization) return null;
                if (configInfo.path !== url) return null;
                if (!verb) return null;
                if ((configInfo.verb) && (configInfo.verb.toUpperCase() !== verb.toUpperCase())) return null;
                if ((!configInfo.verb) && ('GET' !== verb.toUpperCase())) return null;
                return configInfo.authorization;
            };
            let configInfo = null;
            if (config.mocks) configInfo = config.mocks.map(map).reduce(reduce);
            if (!configInfo && config.microservices) configInfo = config.microservices.map(map).reduce(reduce);
            if (!configInfo && config.endpoints) configInfo = config.endpoints.map(map).reduce(reduce);
            if (!configInfo && config.databaseConnections) {
                let mapDB = ( configInfo ) => {
                    if (!configInfo.authorization) return null;
                    if (!configInfo.name) return null;
                    if (!url.startsWith('/' + configInfo.name)) return null;
                    return configInfo.authorization;
                };
                configInfo = config.databaseConnections.map(mapDB).reduce(reduce);
            }
            if (!configInfo) return (next && next());
            let contains = (array, object) => {
                for (let loop = 0; loop < array.length; loop++) {
                    if (array[loop] === object) return true;
                }
                return false;
            };
            let mapAuthorized = ( userAuthGroup ) => { return contains(configInfo.groups, userAuthGroup); };
            let authorized = account.groups.map(mapAuthorized).reduce(reduce);
            if (!authorized) {
                const err = { operation: operation, statusType: 'error', status: 403, message: I18n.get( Strings.UNAUTHORIZED )};
                Log.error(Log.stringify(err));
                res.status(err.status);
                res.send(Log.stringify(err))
                return;
            }
            next && next();
        }
    }
}

module.exports = LocalStrategy;
