let Server = require('./server.js');
let port = process.env.MOCK_SEREVER_PORT || '3000';
let server = new Server().init(port, './config', null);
module.exports = server;
