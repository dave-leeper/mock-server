let Server = require('./server.js');
let port = process.env.MOCK_SEREVER_PORT || '3000';
let serverConfig = require('./server-config.json');
let server = new Server().init(port, serverConfig);

module.exports = server;
