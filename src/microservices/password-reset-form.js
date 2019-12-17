let I18n = require('../util/i18n' );
let Log = require('../util/log' );
let Registry = require('../util/registry' );
let Strings = require('../util/strings' );

class PasswordResetForm {
    static get userPath() {  return "./private/users/"; }
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            if (!params.params.token) {
                let message = I18n.get( Strings.ERROR_MESSAGE_INVALID_RESET_TOKEN );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
            let user;
            let now = Date.now();
            let accounts = Registry.get( "Accounts" );
            for (let i = accounts.length - 1; 0 <= i; i--) {
                if (accounts[i].resetPasswordToken && accounts[i].resetPasswordExpires && params.params.token === accounts[i].resetPasswordToken && now < accounts[i].resetPasswordExpires) {
                    user = accounts[i];
                    break;
                }
            }
            if (!user) {
                let message = I18n.get( Strings.ERROR_MESSAGE_INVALID_RESET_TOKEN );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }

            inResolve && inResolve({ 
                status: 200, 
                viewName: "password-reset-form", 
                viewObject: { 
                    title: "Reset Password", 
                    verb: "POST", 
                    action: "/user/password/reset/update",
                    token: params.params.token
                }
            });
       });
    }
}
module.exports = PasswordResetForm;
