let I18n = require('../util/i18n' );
let Log = require('../util/log' );
let Strings = require('../util/strings' );
let AddAccount = require('./add-account' );

class AuthenticateUser {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let message = Strings.format(I18n.get( Strings.LOGIN_SUCCESSFUL ), params.params.username);
            this.doRemember(params, params.body.username)
            if (Log.will(Log.INFO)) Log.info(message);
            inResolve && inResolve({ status: 200, send: message});
        });
    }
    doRemember(params, username) {
        let rememberMe = params.body.rememberMe
        if ('true' === rememberMe) {
            AddAccount.rememberUser(params, username)
         }else {
            AddAccount.forgetUser(params, username)
        }
    }
}
module.exports = AuthenticateUser;
