let Encrypt = require('../util/encrypt' );
let Files = require('../util/files' );
let I18n = require('../util/i18n' );
let Log = require('../util/log' );
let path = require('path' );
let Registry = require('../util/registry' );
let Strings = require('../util/strings' );
let AddAccount = require('./add-account' );

class UpdateAccount extends AddAccount{
    validateEmail(body, account, accounts){
        let user = Registry.getUserAccount(account.username);
        if (!user) return { status: 400, send: Strings.format(I18n.get( Strings.ERROR_MESSAGE_USER_NOT_FOUND ), body.email)};
        if (body.email === user.email) return { status: 200 };
        if (!body.email || 5 > body.email.length || -1 == body.email.indexOf('@') || -1 == body.email.indexOf('.')) return { status: 400, send: Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_EMAIL ), body.email)};
        for ( let i = 0; i < accounts.length; i++) {
            if (user.username === accounts[i].username) continue;
            if (body.email === accounts[i].email) return { status: 400, send: Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_EMAIL ), body.email)};
        }
        return { status: 200 };
    }
    validateDatabase(body){
        if (!Files.existsSync(path.resolve(AddAccount.userPath + body.username))) return { status: 400, send: Strings.format(I18n.get( Strings.ERROR_MESSAGE_ACCOUNT_DOES_NOT_EXIST ), body.username)};
        return { status: 200 };
    }
    updateAccounts(newAccount, accounts, inResolve, inReject) {
        if (accounts && accounts.length) {
            for (let i = accounts.length - 1; 0 <= i; i--) {
                if (newAccount.username.toUpperCase() === accounts[i].username.toUpperCase()) {
                    newAccount.transactionDate = accounts[i].transactionDate;
                    accounts[i] = newAccount;
                    return true;
                }
            }
        }
        let message = I18n.get( Strings.ERROR_MESSAGE_ACCOUNT_DOES_NOT_EXIST );
        if (Log.will(Log.ERROR)) Log.error(message);
        inReject && inReject({status: 400, send: message});
        return false;
    }
    writeAccount(newAccount, destination, accounts, inResolve, inReject) {
        let newUserPath = path.resolve(AddAccount.userPath + newAccount.username);

        let crypto = Registry.get( "Crypto" );
        let successCallback = () => {
            let message = I18n.get( Strings.SUCCESS_MESSAGE_ACCOUNT_UPDATED );
            Registry.unregister("Accounts");
            Registry.register(accounts, "Accounts");
            inResolve && inResolve({ status: 200, send: message});
        };
        let failCallback = (error) => {
            let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED ), Log.stringify( error ) );
            if (Log.will(Log.ERROR)) Log.error(message);
            inReject && inReject({ status: 500, send: message});
        };
        Files.writeFileLock(
            path.resolve(destination),
            JSON.stringify( { "accounts": Encrypt.encryptAccounts( accounts,  crypto.iv, crypto.key )}, null, 3 ),
            5,
            successCallback,
            failCallback
        );
    }
}
module.exports = UpdateAccount;
