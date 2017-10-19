'use strict'

var elasticsearch = require('elasticsearch');

function ElasticSearchDatabaseConnector ( ) {
    this.client = null;
    this.config = null;
}

ElasticSearchDatabaseConnector.prototype.connect = function (config ) {
    // Elasticsearch mangles configs, so copy it.
    let configCopy = {};
    let prop;

    for (prop in config.config) {
        configCopy[prop] = config.config[prop];
    }
    this.client = new elasticsearch.Client(configCopy);
    this.config = config;
    return this.client;
};

ElasticSearchDatabaseConnector.prototype.disconnect = function ( ) {
    if (!this.client) {
        return;
    }
    elasticsearch.Client(config.config).
    this.client.
    this.config = config;
    return this.client;
};

module.exports = ElasticSearchDatabaseConnector;
