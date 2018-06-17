const LocalStrategy = require('passport-local').Strategy;
const accounts = require('./authentication').accounts;
const Strings = require('../util/strings' );
const I18n = require('../util/i18n' );
const Log = require('../util/log' );

class LocalAuthenticationStrategy {
    getStrategy() {
        return new LocalStrategy((username, password, done)=>  {
            let operation = 'login';
            if (!accounts) {
                const err = { operation: operation, statusType: 'error', status: 501, message: I18n.get( Strings.LOGIN_NOT_CONFIGURED )};
                Log.error(Log.stringify(err));
                return done(err);
            }
            for (let loop = 0; loop < accounts.length; loop++) {
                let account = accounts[loop];
                if (account.username !== username) continue;
                if (account.password !== password) {
                    return done( null, false, { operation: operation, statusType: 'error', status: 401, message: I18n.get( Strings.INCORRECT_PASSWORD )});
                }
                return done(null, { operation: operation, statusType: 'success', status: 200, username: account.username, message: I18n.get( Strings.LOGIN_SUCCESSFUL )});
            }
            return done( null, false, { operation: operation, statusType: 'error', status: 401, message: I18n.get( Strings.INCORRECT_USER_NAME )});
        });
    }
}

module.exports = LocalAuthenticationStrategy;
