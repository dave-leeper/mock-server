let Log = require('../util/log' );

class Remember {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            let userMachine = params.headers["origin"];
            if (!userMachine) {
                inResolve && inResolve({ status: 404, send: { user: '' }});
                return
            }
            let machines = require('../../private/machines/machines.json')
            for (let i = 0; i < machines.length; i++) {
                let machine = machines[i]
                if (machine.machine !== userMachine) continue;
                inResolve && inResolve({ status: 200, send: { user: machine.username }});
                return
            }
            inResolve && inResolve({ status: 404, send: { user: '' }});
        })
    }
}
module.exports = Remember;
