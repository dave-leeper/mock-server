let Encrypt = require('../util/encrypt' );
let Files = require('../util/files' );
let I18n = require('../util/i18n' );
let Log = require('../util/log' );
let path = require('path' );
let Registry = require('../util/registry' );
let Strings = require('../util/strings' );

class AddAccount {
    static get userPath() { return "./private/users/"; }
    static get machinesPath() { return "./private/machines/"; }
    static get destination() { return "./private/users/authentication.json"; }
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let body = params.body;
            let accounts = Registry.get( "Accounts" );
            let newAccount = this.buildAccount(body);
            let validateResult = this.validate(body, newAccount, accounts);
            if ((200 !== validateResult.status)) {
                if (Log.will(Log.ERROR)) Log.error(validateResult.send);
                inReject && inReject(validateResult);
            }

            if (this.updateAccounts(newAccount, accounts, inResolve, inReject)) {
                AddAccount.rememberUser(params, newAccount.username)
                this.writeAccount(newAccount, AddAccount.destination, accounts, inResolve, inReject);
            }
       });
    }
    validate(body, account, accounts){
        if (!body.username) return { status: 400, send: Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_USER_NAME ), body.username)};
        if (!body.password) return { status: 400, send: Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_PASSWORD ), body.username)};
        if (!body.group1 && !body.group2 && !body.group3 ) return { status: 400, send: Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_GROUP ), body.username)};
        let emailStatus =  this.validateEmail(body, account, accounts);
        if (200 != emailStatus.status) return emailStatus;
        return this.validateDatabase(body);
    }
    validateEmail(body, account, accounts){
        if (!body.email || 5 > body.email.length || -1 == body.email.indexOf('@') || -1 == body.email.indexOf('.')) return { status: 400, send: Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_EMAIL ), body.email)};
        for ( let i = 0; i < accounts.length; i++) {
            if (body.email === accounts[i].email) return { status: 400, send: Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_EMAIL ), body.email)};
        }
        return { status: 200 };
    }
    validateDatabase(body){
        if (Files.existsSync(path.resolve(AddAccount.userPath + body.username))) return { status: 400, send: Strings.format(I18n.get( Strings.ERROR_MESSAGE_ACCOUNT_ALREADY_EXISTS ), body.username)};
        return { status: 200 };
    }
    buildAccount(body) {
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
        if (body.email) newAccount.email = body.email;
        if (body.firstName) newAccount.firstName = body.firstName;
        if (body.lastName) newAccount.lastName = body.lastName;
        let now = new Date();
        let transactionDate = "" + now.getFullYear() + "-"  + (now.getMonth() + 1) + "-" + now.getDate();
        newAccount.transactionDate = transactionDate;
        return newAccount;
    }
    updateAccounts(newAccount, accounts, inResolve, inReject) {
        if (accounts && accounts.length) {
            for (let i = accounts.length - 1; 0 <= i; i--) {
                if (newAccount.username.toUpperCase() === accounts[i].username.toUpperCase()) {
                    let message = I18n.get( Strings.ERROR_MESSAGE_ACCOUNT_ALREADY_EXISTS );
                    if (Log.will(Log.ERROR)) Log.error(message);
                    inReject && inReject({status: 400, send: message});
                    return false;
                }
            }
            accounts.push(newAccount);
        }
        else {
            accounts =  [ newAccount ];
        }
        return true;
    }
    writeAccount(newAccount, destination, accounts, inResolve, inReject) {
        let newUserPath = path.resolve(AddAccount.userPath + newAccount.username);
        Files.createDirSync(newUserPath);
        Files.writeFileSync(newUserPath + "/owned.json", "[]");
        Files.writeFileSync(newUserPath + "/favorites.json", "[]");
        Files.writeFileSync(newUserPath + "/cart.json", "[]");

        let crypto = Registry.get( "Crypto" );
        let successCallback = () => {
            let message = I18n.get( Strings.SUCCESS_MESSAGE_ACCOUNT_ADDED );
            Registry.unregister("Accounts");
            Registry.register(accounts, "Accounts");
            inResolve && inResolve({ status: 200, send: message});
        };
        let failCallback = (error) => {
            let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED ), Log.stringify( error ) );
            if (Log.will(Log.ERROR)) Log.error(message);
            inReject && inReject({ status: 500, send: message});
        };
        Log.error(path.resolve(destination))
        Files.writeFileLock(
            path.resolve(destination),
            JSON.stringify( { "accounts": Encrypt.encryptAccounts( accounts,  crypto.iv, crypto.key )}, null, 3 ),
            5,
            successCallback,
            failCallback
        );
    }
    makeCookie(name, value, expires, maxAge){
        let cookie = { name: name, value: value };
        if (expires) cookie.expires = expires;
        if (maxAge) cookie.maxAge = maxAge;
        return cookie;
    }
    static rememberUser(params, username) {
        Log.error('rememberUser')
        let machine = params.headers["origin"];
        Log.error('machine: ' + machine)
        let record = { machine: machine, username: username };
        let machinesFile = path.resolve(AddAccount.machinesPath + "machines.json");
        let machinesData = require(machinesFile)
        for (let i = 0; i < machinesData.length; i++) {
            let md = machinesData[i];
            Log.error('md: ' + JSON.stringify(md))
            if (md.machine === record.machine) {
                return;
            }
        }
        Log.error('add')
        machinesData.push(record);
        Files.writeFileSync(machinesFile, JSON.stringify(machinesData));
    }
    static forgetUser(params, username) {
        Log.error('forgetUser')
        let machine = params.headers["origin"];
        Log.error('machine: ' + machine)
        let record = { machine: machine, username: username };
        let machinesFile = path.resolve(AddAccount.machinesPath + "machines.json");
        let machinesData = require(machinesFile)
        for (let i = machinesData.length - 1; 0 <= i; i--) {
            let md = machinesData[i];
            Log.error('md: ' + JSON.stringify(md))
            if (md.machine === record.machine) {
                Log.error('match')
                machinesData.splice(i, 1)
                Files.writeFileSync(machinesFile, JSON.stringify(machinesData));
                return;
            }
        }
    }
}
module.exports = AddAccount;
