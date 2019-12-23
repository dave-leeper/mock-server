const path = require('path');
const Files = require('../util/files');
const I18n = require('../util/i18n');
const Log = require('../util/log');
const Strings = require('../util/strings');

class DeleteFavorite {
  do(params) {
    return new Promise((inResolve, inReject) => {
      const { body } = params;
      let filePath = './private/users/';

      if (!body.username) {
        const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_INCORRECT_USER_NAME), body.username);
        if (Log.will(Log.ERROR)) Log.error(message);
        inReject && inReject({ status: 400, send: message });
        return;
      }
      if (!Files.existsSync(filePath + body.username)) {
        const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_INCORRECT_USER_NAME), body.username);
        if (Log.will(Log.ERROR)) Log.error(message);
        inReject && inReject({ status: 400, send: message });
        return;
      }
      filePath += `${body.username}/favorites.json`;
      if (!body.id) {
        const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_FAVORITE_DELETE_FAILED), body.username);
        if (Log.will(Log.ERROR)) Log.error(message);
        inReject && inReject({ status: 400, send: message });
        return;
      }
      if (!body.issue) {
        const message = I18n.get(Strings.ERROR_MESSAGE_FAVORITE_DELETE_FAILEDs);
        if (Log.will(Log.ERROR)) Log.error(message);
        inReject && inReject({ status: 400, send: message });
        return;
      }

      let favorites = [];
      const newFavorite = { id: body.id, issue: body.issue };
      if (Files.existsSync(filePath)) {
        const JSONString = Files.readFileSync(filePath);
        favorites = JSON.parse(JSONString);
        for (let i = favorites.length - 1; i >= 0; i--) {
          if (favorites[i].id.toUpperCase() === newFavorite.id.toUpperCase() && favorites[i].issue === newFavorite.issue) {
            const successCallback = () => {
              const message = I18n.get(Strings.SUCCESS_MESSAGE_FAVORITE_DELETED);
              inResolve && inResolve({ status: 200, send: message });
            };
            const failCallback = (error) => {
              const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_FAVORITE_DELETE_FAILED), Log.stringify(error));
              if (Log.will(Log.ERROR)) Log.error(message);
              inReject && inReject({ status: 500, send: message });
            };
            favorites.splice(i, 1);
            Files.writeFileLock(
              path.resolve(filePath),
              JSON.stringify(favorites),
              5,
              successCallback,
              failCallback,
            );
            return;
          }
        }
      }
      const message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_FAVORITE_DELETE_FAILED), Log.stringify(error));
      if (Log.will(Log.ERROR)) Log.error(message);
      inReject && inReject({ status: 404, send: message });
    });
  }
}
module.exports = DeleteFavorite;
