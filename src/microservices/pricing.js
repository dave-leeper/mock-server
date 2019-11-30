let Encrypt = require('../util/encrypt' );
let Files = require('../util/files' );
let I18n = require('../util/i18n' );
let Log = require('../util/log' );
let path = require('path' );
let Registry = require('../util/registry' );
let Strings = require('../util/strings' );

class Pricing {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let body = params.body;
            let price = 0.0;
            let taxes = 0.0;

            if (!body.books) {
                let message = I18n.get( Strings.ERROR_MESSAGE_BOOK_LIST_REQUIRED );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
            let books;
            try {
                books = JSON.parse(body.books);
            } catch (error) {
                let message = I18n.get( Strings.ERROR_MESSAGE_BOOK_LIST_REQUIRED );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
            if (!Array.isArray(books)) {
                let message = I18n.get( Strings.ERROR_MESSAGE_BOOK_LIST_REQUIRED );
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({ status: 400, send: message});
                return;
            }
            for (let i = books.length - 1; i >= 0; i --) {
                let book = books[i];
                let bookPath = "./public/files/comics/" + book.id + "/" + book.issue;
                if (!Files.existsSync(bookPath)) {
                    let message = Strings.format(I18n.get( Strings.ERROR_MESSAGE_INVALID_BOOK_ISSUE ), book.issue);
                    if (Log.will(Log.ERROR)) Log.error(message);
                    inReject && inReject({ status: 400, send: message});
                    return;
                }
            }

            let prices = [];
            for (let i = books.length - 1; i >= 0; i --) {
                let book = books[i];
                let bookPath = "./public/files/comics/" + book.id + "/" + book.issue + "/manifest.json";
                prices.push(this.getPrice(bookPath));
            }
            Promise.all(prices).then((values) => {
                price = values.reduce((a, b) => a + b, 0)
                inResolve && inResolve ({ status: 200, send: { subtotal: price.toFixed(2), taxes: taxes.toFixed(2) }});
            }).catch((error) =>{
                let message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_ERROR_READING_BOOKS), Log.stringify(error));
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({status: 500, send: message});
            });
        });
    }
    getPrice(bookPath) {
        return new Promise (( inResolve, inReject ) => {
            let book = Files.readFileSync(bookPath);
            try {
                book = JSON.parse(book);
            } catch (error) {
                let message = Strings.format(I18n.get(Strings.ERROR_MESSAGE_ERROR_READING_BOOKS), Log.stringify(error));
                if (Log.will(Log.ERROR)) Log.error(message);
                inReject && inReject({status: 500, send: message});
                return;
            }
            inResolve(parseFloat(book.price));
        });
    }
}
module.exports = Pricing;
