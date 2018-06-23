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
    getStrategy() {
        return new PassportLocalStrategy((username, password, done) => {
            let operation = 'login';
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
            return done( null, false, { operation: operation, statusType: 'error', status: 401, message: I18n.get( Strings.INCORRECT_USER_NAME )});
        });
    }
}

module.exports = LocalStrategy;
