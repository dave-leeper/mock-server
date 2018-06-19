let Log = require('../util/log' );
let Registry = require('../util/registry' );

class Mocks {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let serverConfig = Registry.get('ServerConfig');
            if ((!serverConfig) || (!serverConfig.mocks)) {
                inReject && inReject({status: 500, send: 'Error looking up mocks.'});
                return;
            }
            if (0 === serverConfig.mocks.length) {
                inResolve && inResolve({status: 200, send: 'There are no mocks.'});
                return;
            }
            let result = [];
            let mocks = serverConfig.mocks;
            for (let loop = 0; loop < mocks.length; loop++) {
                let mock = mocks[loop];
                result.push({
                    "path": mock.path,
                    "response": mock.response,
                    "responseType": mock.responseType
                });
            }
            inResolve && inResolve ({ status: 200, send: Log.stringify(result) });
        });
    }
}
module.exports = Mocks;
