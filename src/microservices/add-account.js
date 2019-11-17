let Files = require('../util/files' );
let I18n = require('../util/i18n' );
let Log = require('../util/log' );
let path = require('path' );
let Registry = require('../util/registry' );
let Strings = require('../util/strings' );

class AuthenticateUser {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            if (!params.body.username) {
                let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_USER_NAME ), params.body.username);
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
            if (!params.body.password) {
                let message = I18n.get( Strings.ERROR_MESSAGE_INCORRECT_PASSWORD );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
            if (!params.body.group) {
                let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_GROUP ), params.body.group);
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }

            Log.error("A");
            let accounts = Registry.get( "Accounts" );
            let newAccount = { username: params.body.username, password: params.body.password, groups: [ params.body.group ]};
            let successCallback = () => {
                Log.error("1");
                let message = I18n.get( Strings.ERROR_MESSAGE_ACCOUNT_ADDED );
                if (Log.will(Log.INFO)) Log.info(message);
                Registry.unregister("Accounts");
                Registry.register(accounts, "Accounts");
                inResolve && inResolve({ status: 200, send: message});
            };
            let failCallback = (error) => {
                Log.error("2");
                let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED ), Log.stringify( error ) );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 500, send: message});
            };
        
            accounts.push( newAccount );
            Log.error("B" + Log.stringify( accounts ));
            Files.writeFileLock(path.resolve('../authentication/authentication2.json'), Log.stringify( accounts ), 5, successCallback, failCallback);
            Log.error("C");
    });
    }
}
module.exports = AuthenticateUser;
