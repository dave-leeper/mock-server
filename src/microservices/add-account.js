let Files = require('../util/files' );
let I18n = require('../util/i18n' );
let Log = require('../util/log' );
let path = require('path' );
let Registry = require('../util/registry' );
let Strings = require('../util/strings' );

class AddUser {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let body = params.body;

            if (!body.destination) {
                let message = I18n.get( Strings.ERROR_MESSAGE_ACCOUNT_ADD_NOT_PROPERLY_CONFIGURED_DESTINATION_REQUIRED );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
            if (!body.username) {
                let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_USER_NAME ), body.username);
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
            if (!body.password) {
                let message = I18n.get( Strings.ERROR_MESSAGE_INCORRECT_PASSWORD );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
            if (!body.group1 && !body.group2 && !body.group3 ) {
                let message = I18n.get( Strings.ERROR_MESSAGE_INCORRECT_GROUP );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }

            let accounts = Registry.get( "Accounts" );
            let newAccount = { 
                username: body.username, 
                password: body.password, 
                groups: [ ]
            };
            if ( body.group1 ) newAccount.groups.push( body.group1 );
            if ( body.group2 ) newAccount.groups.push( body.group2 );
            if ( body.group3 ) newAccount.groups.push( body.group3 );
            if ( body.headername1 || body.headername2 || body.headername3 ) {
                newAccount.headers = [  ];
                if ( body.headername1 ) newAccount.headers.push({ header: body.headername1, value: body.headervalue1 });
                if ( body.headername2 ) newAccount.headers.push({ header: body.headername2, value: body.headervalue2 });
                if ( body.headername3 ) newAccount.headers.push({ header: body.headername3, value: body.headervalue3 });
            }
            if ( body.cookiename1 || body.cookiename2 || body.cookiename3 ) {
                newAccount.cookies = [  ];
                if ( body.cookiename1 ) newAccount.cookies.push( this.makeCookie(body.cookiename1, body.cookievalue1, body.cookieepires1, body.cookiemaxage1 ));
                if ( body.cookiename2 ) newAccount.cookies.push( this.makeCookie(body.cookiename2, body.cookievalue2, body.cookieepires2, body.cookiemaxage2 ));
                if ( body.cookiename3 ) newAccount.cookies.push( this.makeCookie(body.cookiename3, body.cookievalue3, body.cookieepires3, body.cookiemaxage3 ));
            }

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
            Files.writeFileLock(path.resolve(body.destination), JSON.stringify( { "accounts": accounts }, null, 3 ), 5, successCallback, failCallback);
        });
    }
    makeCookie(name, value, expires, maxAge){
        let cookie = { name: name, value: value };
        if (expires) cookie.expires = expires;
        if (maxAge) cookie.maxAge = maxAge;
        return cookie;
    }
}
module.exports = AddUser;
