const nodemailer = require('nodemailer');
const path = require('path');
const Encrypt = require('../util/encrypt');
const Files = require('../util/files');
const I18n = require('../util/i18n');
const Log = require('../util/log');
const Registry = require('../util/registry');
const Strings = require('../util/strings');

class PasswordUpdate {
  static get destination() { return './private/users/authentication.json '; }

  do(params) {
    return new Promise((inResolve, inReject) => {
      const { body } = params;
      if (!body.password || !body.reenterPassword || body.password !== body.reenterPassword) {
        const message = I18n.get(Strings.ERROR_MESSAGE_INCORRECT_PASSWORD);
        if (Log.will(Log.ERROR)) Log.error(message);
        inReject && inReject({ status: 400, send: message });
        return;
      }
      let user;
      const now = Date.now();
      const accounts = Registry.get('Accounts');
      for (let i = accounts.length - 1; i >= 0; i--) {
        if (accounts[i].resetPasswordToken && accounts[i].resetPasswordExpires && body.token === accounts[i].resetPasswordToken && now < accounts[i].resetPasswordExpires) {
          user = accounts[i];
          break;
        }
      }
      if (!user) {
        const message = I18n.get(Strings.ERROR_MESSAGE_INVALID_RESET_TOKEN);
        if (Log.will(Log.ERROR)) Log.error(message);
        inReject && inReject({ status: 400, send: message });
        return;
      }
      user.password = body.password;

      const successCallback = () => {
        const message = I18n.get(Strings.SUCCESS_MESSAGE_ACCOUNT_UPDATED);
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'magicjtv@gmail.com',
            pass: '0212Today',
          },
        });
        const msg = {
          to: user.email,
          from: 'davidkleeper@gmail.com',
          subject: 'Password Reset Complete',
          text: 'Your password for your U.S. Comics acount was successfully updated.\n',
        };
        transporter.sendMail(msg, (error, data) => {
          if (error) {
            Log.error(error);
            const message2 = Strings.format(I18n.get(Strings.ERROR_MESSAGE_SEND_EMAIL_FAILED), error);
            if (Log.will(Log.ERROR)) Log.error(message2);
            inReject && inReject({ status: 409, send: message2 });
            return;
          }
          inResolve && inResolve({ status: 200, send: message });
        });
      };
      const failCallback = (error) => {
        const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_ADD_FAILED), Log.stringify(error));
        if (Log.will(Log.ERROR)) Log.error(message);
        inReject && inReject({ status: 500, send: message });
      };
      const crypto = Registry.get('Crypto');
      Files.writeFileLock(
        path.resolve(PasswordUpdate.destination),
        JSON.stringify({ accounts: Encrypt.encryptAccounts(accounts, crypto.iv, crypto.key) }, null, 3),
        5,
        successCallback,
        failCallback,
      );
    });
  }
}
module.exports = PasswordUpdate;
