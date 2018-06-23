let Registry = require('../util/registry');
let ServiceBase = require ( '../util/service-base.js' );

class Hotswap extends ServiceBase {
    Hotswap(configInfo) {
        this.configInfo = configInfo;
    }
    do (req, res, next) {
        this.addHeaders(this.configInfo, req, res);
        this.addCookies(this.configInfo, req, res);
        let server = Registry.get('Server');
        let port = Registry.get('Port');
        let newConfig = req.files['filename'];
        let newConfigString = newConfig.data.toString();
        let newConfigJSON = JSON.parse(newConfigString);
        if (!server || !server.stop || !server.init || !port || !newConfig) {
            let jsonResponse = JSON.stringify({status: 'Error hot-swapping server'});
            res.status(500);
            res.send(jsonResponse);
            next();
            return;
        }
        let jsonResponse = JSON.stringify({status: 'Hot-swapping server'});
        res.status(200);
        res.send(jsonResponse);
        server.stop( () => {
            server.init(port, newConfigJSON);
        } );
    }
}

module.exports = Hotswap;
