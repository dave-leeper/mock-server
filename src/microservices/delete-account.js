const path = require('path');
const Files = require('@src/util/files');
const I18n = require('@src/util/i18n');
const Log = require('@src/util/log');
const Registry = require('@src/util/registry');
const Strings = require('@src/util/strings');
const AddAccount = require('./add-account');

class DeleteAccount {
  do(reqInfo) {
    return new Promise((inResolve, inReject) => {
      try {
        const { body } = reqInfo;
        const { username } = body;
        const userPath = `${AddAccount.userPath}/${username}`
        AddAccount.forgetUserByUserName(username);
        Files.deleteDirSync(userPath);

        this.deleteFromRegistry(username);
        this.deleteFromAuthenticationFile(username);
      } catch (error) {
        const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_OPERATION_FAILED), Log.stringify(error));
        if (Log.will(Log.ERROR)) Log.error(message);
        inReject && inReject({ status: 500, send: message });
      }
    }
  }

  deleteFromRegistry(username) {
    let accounts = Registry.get('Accounts');
    if (accounts && accounts.length) {
      for (let i = accounts.length - 1; i >= 0; i--) {
        if (username.toUpperCase() === accounts[i].username.toUpperCase()) {
          accounts.splice(i, 1);
          Registry.register(accounts, 'Accounts');
          break;
        }
      }
    }
  }

  deleteFromAuthenticationFile(username) {
    const writeSuccessCallback = () => {
      const message = I18n.get(Strings.SUCCESS_MESSAGE_ACCOUNT_ADDED);
      Registry.unregister('Accounts');
      Registry.register(accounts, 'Accounts');
      inResolve && inResolve({ status: 200, send: message });
    };
    const writeFailCallback = (error) => {
      const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_OPERATION_FAILED), Log.stringify(error));
      if (Log.will(Log.ERROR)) Log.error(message);
      inReject && inReject({ status: 500, send: message });
    };
    const readSuccessCallback = (authentication) => {
      if (authentication && authentication.accounts && authentication.accounts.length) {
        for (let i = authentication.accounts.length - 1; i >= 0; i--) {
          if (username.toUpperCase() === authentication.accounts[i].username.toUpperCase()) {
            authentication.accounts.splice(i, 1);
            Files.writeFileLock(
              path.resolve(destination),
              JSON.stringify({ accounts: authentication.accounts }, null, 3),
              5,
              writeSuccessCallback,
              writeFailCallback,
            );
            break;
          }
        }
      }
    };
    const readFailCallback = (error) => {
      const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_OPERATION_FAILED), Log.stringify(error));
      if (Log.will(Log.ERROR)) Log.error(message);
      inReject && inReject({ status: 500, send: message });
    };

    Files.readFileLock(
      path.resolve(AddAccount.authenticationFile),
      5,
      readSuccessCallback,
      readFailCallback,
    );
  }
}
module.exports = DeleteAccount;
