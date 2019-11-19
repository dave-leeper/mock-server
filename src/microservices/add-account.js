let Files = require('../util/files' );
let I18n = require('../util/i18n' );
let Log = require('../util/log' );
let path = require('path' );
let Registry = require('../util/registry' );
let Strings = require('../util/strings' );

class AddUser {
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

            let accounts = Registry.get( "Accounts" );
            let newAccount = { 
                username: params.body.username, 
                password: params.body.password, 
                groups: [ params.body.group ]
            };
            let successCallback = () => {
                let message = I18n.get( Strings.ERROR_MESSAGE_ACCOUNT_ADDED );
                Registry.unregister("Accounts");
                Registry.register(accounts, "Accounts");
                inResolve && inResolve({ status: 200, send: message});
            };
            let failCallback = (error) => {
                let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED ), Log.stringify( error ) );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 500, send: message});
            };

            if (accounts && accounts.length) {
                let i = accounts.length;
                while (i--) {
                    if (accounts[i].username.toUpperCase() === newAccount.username.toUpperCase()) {
                        accounts.splice(i, 1);
                        break;
                    }
                }
                accounts.push(newAccount);
            }
            else {
                accounts =  [ newAccount ];
            }
            Files.writeFileLock(path.resolve('./src/authentication/authentication.json'), JSON.stringify( { "accounts": accounts }, null, 3 ), 5, successCallback, failCallback);
        });
    }
}
module.exports = AddUser;
