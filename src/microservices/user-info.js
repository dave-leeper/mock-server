let Files = require('../util/files' );
let I18n = require('../util/i18n' );
let Log = require('../util/log' );
let path = require('path' );
let Strings = require('../util/strings' );

class UserInfo {
    static get userPath() {  return "./src/authentication/authentication.json"; }
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let usersData;
            try {
                usersData = Files.readFileSync(UserInfo.userPath);
            } catch (e) {
                let message =  I18n.get( Strings.ERROR_MESSAGE_ERROR_READING_USER_INFO );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({status: 500, send: message});
                return;
            }

            let usersArray = JSON.parse(usersData).accounts;
            if (!usersArray || !Array.isArray(usersArray)) {
                let message =  I18n.get( Strings.ERROR_MESSAGE_ERROR_READING_USER_INFO );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({status: 500, send: message});
                return;
            }

            for (let i = 0; i < usersArray.length; i++) {
                if (usersArray[i].username === params.params.user) {
                    let user = usersArray[i];
                    inResolve && inResolve({ status: 200, send: JSON.stringify({ username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email })});
                    return;
                }
            }
            let message =  I18n.get( Strings.ERROR_MESSAGE_INCORRECT_USER_NAME );
            if (Log.will(Log.ERROR)) Log.error(message);
            inReject && inReject({status: 400, send: message});
            return;
       });
    }
}
module.exports = UserInfo;
