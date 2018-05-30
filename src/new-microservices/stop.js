class Stop {
    do(params) {
        return new Promise (( inResolve, inReject ) => {
            if ((!params.server)) {
                inReject && inReject ({ status: 500, send: 'Server not found.' });
                return;
            }
            params.server.stop(
                () => { inResolve && inResolve({ status: 200, send: 'Server stopped.' })}
            );
        });
    }
}
module.exports = Stop;
