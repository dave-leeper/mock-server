let Encrypt = require('../util/encrypt' );
let Files = require('../util/files' );
let I18n = require('../util/i18n' );
let Log = require('../util/log' );
let nodemailer = require('nodemailer');
let path = require('path' );
let Registry = require('../util/registry' );
let Strings = require('../util/strings' );

class PasswordUpdate {
    static get destination() { return "./private/users/authentication.json "; }
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let body = params.body;
            if (!body.password || !body.reenterPassword || body.password !== body.reenterPassword) {
                let message = I18n.get( Strings.ERROR_MESSAGE_INCORRECT_PASSWORD );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
            let user;
            let now = Date.now();
            let accounts = Registry.get( "Accounts" );
            for (let i = accounts.length - 1; 0 <= i; i--) {
                if (accounts[i].resetPasswordToken && accounts[i].resetPasswordExpires && body.token === accounts[i].resetPasswordToken && now < accounts[i].resetPasswordExpires) {
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
            user.password = body.password;

            let successCallback = () => {
                let message = I18n.get( Strings.SUCCESS_MESSAGE_ACCOUNT_UPDATED );
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'magicjtv@gmail.com',
                        pass: '0212Today'
                    }
                });
                const msg = {
                    to: user.email,
                    from: 'davidkleeper@gmail.com',
                    subject: 'Password Reset Complete',
                    text: 'Your password for your U.S. Comics acount was successfully updated.\n'
                };
                transporter.sendMail(msg, (error, data) => {
                    if (error) {
                        Log.error(error)
                        let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_SEND_EMAIL_FAILED ), error);
                        if (Log.will(Log.ERROR)) Log.error(message);
                        res.status(400);
                        res.send(message);
                        return;
                    }
                    inResolve && inResolve({ status: 200, send: message});
                });
            };
            let failCallback = (error) => {
            let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED ), Log.stringify( error ) );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 500, send: message});
            };
            let crypto = Registry.get( "Crypto" );
            Files.writeFileLock(
                path.resolve(PasswordUpdate.destination),
                JSON.stringify( { "accounts": Encrypt.encryptAccounts( accounts, crypto.iv, crypto.key )}, null, 3 ),
                5,
                successCallback,
                failCallback
            );
       });
    }
}
module.exports = PasswordUpdate;
