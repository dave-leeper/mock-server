let I18n = require('../util/i18n' );
let Log = require('../util/log' );
let Strings = require('../util/strings' );

class AuthenticateUser {
    static get userPath() {  return "./private/users/"; }
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let message = Strings.format(I18n.get( Strings.LOGIN_SUCCESSFUL ), params.params.username);
            if (Log.will(Log.INFO)) Log.info(message);
            inResolve && inResolve({ status: 200, send: message});
        });
    }
}
module.exports = AuthenticateUser;
