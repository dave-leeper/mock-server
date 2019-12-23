const I18n = require('../util/i18n');
const Log = require('../util/log');
const Strings = require('../util/strings');
const AddAccount = require('./add-account');

class AuthenticateUser {
  do(params) {
    return new Promise((inResolve, inReject) => {
      const message = Strings.format(I18n.get(Strings.LOGIN_SUCCESSFUL), params.params.username);
      this.doRemember(params, params.body.username);
      if (Log.will(Log.INFO)) Log.info(message);
      inResolve && inResolve({ status: 200, send: message });
    });
  }

  doRemember(params, username) {
    const { rememberMe } = params.body;
    if (rememberMe === 'true') {
      AddAccount.rememberUser(params, username);
    } else {
      AddAccount.forgetUser(params, username);
    }
  }
}
module.exports = AuthenticateUser;
