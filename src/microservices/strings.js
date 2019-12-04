let Log = require('../util/log' );
let StringsData = require('../util/strings-en-US' );

class Strings {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            inResolve && inResolve ({ status: 200, viewName:"strings", viewObject: { title: "Strings", strings: StringsData }});
        });
    }
}

module.exports = Strings;
