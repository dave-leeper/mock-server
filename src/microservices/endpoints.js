let Log = require('../util/log' );
let Registry = require('../util/registry' );

class Endpoints {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let serverConfig = Registry.get('ServerConfig');
            if ((!serverConfig) || (!serverConfig.endpoints)) {
                let error = 'Error looking up endpoints.';
                Log.error(Log.stringify(error));
                inReject && inReject({status: 500, send: error });
                return;
            }
            if (0 === serverConfig.endpoints.length) {
                inResolve && inResolve({status: 200, send: 'There are no endpoints.'});
                return;
            }
            let result = [];
            let endpoints = serverConfig.endpoints;
            for (let loop = 0; loop < endpoints.length; loop++) {
                let service = endpoints[loop];
                result.push({
                    "name": service.name,
                    "path": service.path,
                    "description": service.description
                });
            }
            inResolve && inResolve ({ status: 200, send: Log.stringify(result) });
        });
    }
}
module.exports = Endpoints;
