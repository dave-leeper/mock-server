const path = require('path');
const Files = require('@src/util/files');
const I18n = require('@src/util/i18n');
const Log = require('@src/util/log');
const Registry = require('@src/util/registry');
const Strings = require('@src/util/strings');
const AddAccount = require('./add-account');

class ExistsAccount {
  do(reqInfo) {
    return new Promise((inResolve, inReject) => {
        try {
            const { body } = reqInfo;
            const { username } = body;
            const userPath = `${AddAccount.userPath}/${username}`
            if (Files.existsSync(userPath)) {
                inResolve && inResolve({ status: 200, send: 'Directory' });
            }
            if (this.searchRegistry(username)) {
                inResolve && inResolve({ status: 200, send: 'Registry' });
            }
            if (this.searchMachines(username)) {
                inResolve && inResolve({ status: 200, send: 'Machines' });
            }
            this.searchAuthenticationFile(username)
        } catch ( error ) {
            const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_OPERATION_FAILED), Log.stringify(error));
            if (Log.will(Log.ERROR)) Log.error(message);
            inReject && inReject({ status: 500, send: message });
        }
    }
}

searchRegistry(username) {
    let accounts = Registry.get('Accounts');
    if (accounts && accounts.length) {
        for (let i = accounts.length - 1; i >= 0; i--) {
            if (username.toUpperCase() === accounts[i].username.toUpperCase()) {
                return true;
            }
        }
    }
    return false;
}

searchMachines(username) {
    const machines = require('@private/machines/machines.json');
    for (let i = machines.length - 1; i >= 0; i--) {
        if (username.toUpperCase() === machines[i].username.toUpperCase()) {
            return true;
        }
    }
    return false;
}

searchAuthenticationFile(username) {
    const readSuccessCallback = (authentication) => {
        if (authentication && authentication.accounts && authentication.accounts.length) {
            for (let i = authentication.accounts.length - 1; i >= 0; i--) {
                if (username.toUpperCase() === authentication.accounts[i].username.toUpperCase()) {
                    inResolve && inResolve({ status: 200, send: 'Authentication' });
                    return;
                }
            }
            const message = I18n.get(Strings.ERROR_MESSAGE_ACCOUNT_DOES_NOT_EXIST);
            if (Log.will(Log.ERROR)) Log.error(message);
            inResolve && inResolve({ status: 404, send: message });
        };
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

module.exports = ExistsAccount;
