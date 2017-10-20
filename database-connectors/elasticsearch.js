'use strict'

var elasticsearch = require('elasticsearch');

function ElasticSearchDatabaseConnector ( name ) {
    this.name = name;
    this.client = null;
    this.config = null;
}

ElasticSearchDatabaseConnector.prototype.connect = function (config ) {
    return new Promise (( inResolve ) => {
        // Elasticsearch mangles configs, so copy it.
        let configCopy = {};
        let prop;

        for (prop in config.config) {
            configCopy[prop] = config.config[prop];
        }
        this.client = new elasticsearch.Client(configCopy);
        this.config = config;
        inResolve && inResolve ( null, this.client );
    });
};

ElasticSearchDatabaseConnector.prototype.ping = function (  )
{
    return new Promise (( inResolve ) => {
        if (!this.client) {
            inResolve && inResolve ( false );
        } else {
            this.client.ping({ requestTimeout: 30000, }, function( error ) {
                if (error) {
                    inResolve && inResolve ( false );
                } else {
                    inResolve && inResolve ( true );
                }
            });
        }
    });
};

ElasticSearchDatabaseConnector.prototype.disconnect = function ( ) {
    return new Promise (( inResolve ) => {
        if (!this.client) {
            inResolve && inResolve ( false );
        } else {
            this.client.close();
            inResolve && inResolve ( true );
        }
    });
};

module.exports = ElasticSearchDatabaseConnector;
