let Files = require('../util/files' );
let I18n = require('../util/i18n' );
let Log = require('../util/log' );
let path = require('path' );
let Registry = require('../util/registry' );
let Strings = require('../util/strings' );

class AddFavorite {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let body = params.body;
            let filePath = "./public/files/comics/users/";
    
            if (!body.username) {
                let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_USER_NAME ), body.username);
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
            if (!Files.existsSync(filePath + body.username)) {
                let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_INCORRECT_USER_NAME ), body.username);
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
            filePath += body.username + "/favorites.json";
            if (!body.id) {
                let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_FAVORITE_ADD_FAILED ), body.username);
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
            if (!body.issue) {
                let message = I18n.get( Strings.ERROR_MESSAGE_FAVORITE_ADD_FAILED );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
    
            let favorites = [];
            let now = new Date();
            let transactionDate = "" + now.getFullYear() + "-"  + (now.getMonth() + 1) + "-" + now.getDate();
            let newFavorite = { id: body.id, issue: body.issue, transactionDate: transactionDate };
            if (Files.existsSync(filePath)) {
                let JSONString = Files.readFileSync(filePath);
                favorites = JSON.parse(JSONString);
                for (let i = favorites.length - 1; i >= 0; i--) {
                    if (favorites[i].id.toUpperCase() === newFavorite.id.toUpperCase() && favorites[i].issue === newFavorite.issue ) favorites.splice( i,  1 );
                };
            }
            favorites.push(newFavorite);
    
            let successCallback = () => {
                let message = I18n.get( Strings.SUCCESS_MESSAGE_FAVORITE_ADDED );
                inResolve && inResolve({ status: 200, send: message});
            };
            let failCallback = (error) => {
                let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_FAVORITE_ADD_FAILED ), Log.stringify( error ) );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 500, send: message});
            };
            Files.writeFileLock(
                path.resolve(filePath),
                JSON.stringify( favorites ),
                5,
                successCallback,
                failCallback
            );
        });
    }
}
module.exports = AddFavorite;