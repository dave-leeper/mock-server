let Registry = require('../util/registry');
let ServiceBase = require ( '../util/service-base.js' );

class Stop extends ServiceBase {
    Stop(configInfo) {
        this.configInfo = configInfo;
    }
    do (req, res, next) {
        this.addHeaders(this.configInfo, req, res);
        this.addCookies(this.configInfo, req, res);
        let server = Registry.get('Server');
        if (!server || !server.stop) {
            let jsonResponse = JSON.stringify({status: 'Error stopping server'});
            res.status(500);
            res.send(jsonResponse);
            next();
        }
        let jsonResponse = JSON.stringify({status: 'Stopping server'});
        res.status(200);
        res.send(jsonResponse);
        server.stop();
    }
}

module.exports = Stop;
