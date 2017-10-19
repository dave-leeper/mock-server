'use strict'

var elasticsearch = require('elasticsearch');

function ElasticSearchDatabaseConnector ( ) {
    this.client = null;
    this.config = null;
}

ElasticSearchDatabaseConnector.prototype.connect = function (config ) {
    this.client = new elasticsearch.Client(config.config);
    this.config = config;
    return this.client;
};

module.exports = ElasticSearchDatabaseConnector;
