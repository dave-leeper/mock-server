let Log = require('../util/log' );
let Registry = require('../util/registry' );

class Microservices {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let serverConfig = Registry.get('ServerConfig');
            if ((!serverConfig) || (!serverConfig.microservices)) {
                let error = 'Error looking up endpoionts.';
                inReject && inReject({status: 500, send: error });
                return;
            }
            if (0 === serverConfig.microservices.length) {
                inResolve && inResolve({status: 200, send: 'There are no endpoionts.'});
                return;
            }
            let result = [];
            let microservices = serverConfig.microservices;
            for (let loop = 0; loop < microservices.length; loop++) {
                let service = microservices[loop];
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
module.exports = Microservices;
