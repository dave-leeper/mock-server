let Strings = require('../util/strings' );
let I18n = require('../util/i18n' );
let Log = require('../util/log' );

class AuthenticateUser {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let message = I18n.get( Strings.LOGIN_SUCCESSFUL );
            if (Log.will(Log.INFO)) Log.info(message + ': ' + params.params.username);
            inResolve && inResolve({ status: 200, send: message});
        });
    }
}
module.exports = AuthenticateUser;
