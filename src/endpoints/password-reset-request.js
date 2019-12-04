let Files = require('../util/files' );
let I18n = require('../util/i18n' );
let Log = require('../util/log' );
let nodemailer = require('nodemailer');
let Registry = require('../util/registry' );
let ServiceBase = require ( '../util/service-base.js' );
let sgMail = require('@sendgrid/mail');
let Strings = require('../util/strings' );
let uuidv4 = require('uuid/v4');

let Authentication = require('../authentication/authentication' );

/*
Order of execution for password reset
1. /user/password/reset/request (mock) - Sends a form that allows user to enter the email of the account that needs a password change.
   The form is password-reset-request.hbs. Clients can write their own form, if desired.
2. /user/password/reset/request/data (endpoints/password-reset-request.js) - Converts an email value into a user account and attaches a reset token and a reset expire time to the account. 
   A link to the url that uses the token is emailed to the user.
3. /user/password/reset/reply/:token (microservices/password-reset-form.js) - Invoked by the link from step 2. Sents an HTML form that allows the user to enter a new password. 
   The form is password-reset-form.hbs
4. /user/password/reset/update (microservices/password-update.js) - Updates the user's password. Sends an email notification that the update occured. 
 */
class PasswordResetRequest extends ServiceBase {
    constructor(configInfo) {
        super();
        this.configInfo = configInfo;
    }
    do(req, res, next) {
        let body = req.body;
        if (!body.email) {
            let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_EMAIL ), body.email);
            if (Log.will(Log.ERROR)) Log.error(message);
            res.status(400);
            res.send(message);
            return;
        }
        let user;
        for (let i = 0; i < Authentication.accounts.length; i++) {
            if (Authentication.accounts[i].email === body.email) {
                user = Authentication.accounts[i];
                break;
            }
        }
        if (!user) {
            let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_EMAIL ), body.email);
            if (Log.will(Log.ERROR)) Log.error(message);
            res.status(400);
            res.send(message);
            return;
        }

        // sendgrid.com
        // user USComics
        // key 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
        let token = uuidv4();
        let userAccount = Registry.getUserAccount(user.username);
        userAccount.resetPasswordToken = token;
        userAccount.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        
        sgMail.setApiKey('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');
        const msg = {
            to: userAccount.email,
            from: 'davidkleeper@gmail.com',
            subject: 'Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your U.S. Comics account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/user/password/reset/reply/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        sgMail.send(msg);
        
        res.status(200);
        res.send("Password reset email has been sent.");
    }
}
module.exports = PasswordResetRequest;