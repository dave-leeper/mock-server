let Registry = require('../util/registry');
let ServiceBase = require ( '../util/service-base.js' );

class HotSwap extends ServiceBase {
    constructor(configInfo) {
        super();
        this.configInfo = configInfo;
    }
    do (req, res, next) {
        this.addHeaders(this.configInfo, req, res);
        this.addCookies(this.configInfo, req, res);
        let server = Registry.get('Server');
        let uploadedFile = req.files['filename'];
        let rawConfig = ((uploadedFile)? uploadedFile.data : null );
        let config = ((rawConfig)? rawConfig.toString() : null );
        if (!server || !server.createRouter || !server.useRouter || !uploadedFile || !config) {
            let jsonResponse = JSON.stringify({status: 'Error hot-swapping server.'});
            res.status(500);
            res.send(jsonResponse);
            next && next();
            return;
        }
        let jsonResponse = JSON.stringify({status: 'Hot-swapping server'});
        res.status(200);
        res.send(jsonResponse);
        let router = server.createRouter(JSON.parse(config));
        server.useRouter(router)
    }
}

module.exports = HotSwap;
