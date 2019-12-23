const Files = require('../util/files');
const I18n = require('../util/i18n');
const Log = require('../util/log');
const Strings = require('../util/strings');

class UserInfo {
  static get userPath() { return './private/users/authentication.json'; }

  do(params) {
    return new Promise((inResolve, inReject) => {
      let usersData;
      try {
        usersData = Files.readFileSync(UserInfo.userPath);
      } catch (e) {
        const message = I18n.get(Strings.ERROR_MESSAGE_ERROR_READING_USER_INFO);
        if (Log.will(Log.ERROR)) Log.error(message);
        inReject && inReject({ status: 500, send: message });
        return;
      }

      const usersArray = JSON.parse(usersData).accounts;
      if (!usersArray || !Array.isArray(usersArray)) {
        const message = I18n.get(Strings.ERROR_MESSAGE_ERROR_READING_USER_INFO);
        if (Log.will(Log.ERROR)) Log.error(message);
        inReject && inReject({ status: 500, send: message });
        return;
      }

      for (let i = 0; i < usersArray.length; i++) {
        if (usersArray[i].username === params.params.user) {
          const user = usersArray[i];
          inResolve && inResolve({
            status: 200,
            send: JSON.stringify({
              username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email,
            }),
          });
          return;
        }
      }
      const message = I18n.get(Strings.ERROR_MESSAGE_INCORRECT_USER_NAME);
      if (Log.will(Log.ERROR)) Log.error(message);
      inReject && inReject({ status: 400, send: message });
    });
  }
}
module.exports = UserInfo;
