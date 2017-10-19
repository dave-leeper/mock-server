var Server = require('./server.js');
var port = process.env.PORT || '3000';
var serverConfig = require('./server-config.json');
var server = new Server().init(port, serverConfig);

module.exports = server;
