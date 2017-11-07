'use strict';

const elasticsearch = require('elasticsearch');

/**
 * Database = N/A
 * Table Definition = Mapping
 * Table = Index/Type
 * @param name - name of the connection.
 * @constructor
 */
function ElasticSearchDatabaseConnector ( name ) {
    this.name = name;
    this.client = null;
    this.config = null;
}
// https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html

ElasticSearchDatabaseConnector.prototype.connect = function ( config ) {
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
            this.client.ping({ requestTimeout: 30000 }, function( error ) {
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

ElasticSearchDatabaseConnector.prototype.tableExists = function ( name ) {
    return new Promise (( inResolve ) => {
        this.client.indices.exists({ index: name }).then(( exists ) => { inResolve && inResolve( exists ); });
    });
};

/**
 * @param mapping - An object that describes the table. Example:
 * {
 *     index: "test",
 *     type: "document",
 *     body: {
 *         properties: {
 *             title: { type: "string" },
 *             content: { type: "string" },
 *             suggest: {
 *                 type: "completion",
 *                 analyzer: "simple",
 *                 search_analyzer: "simple",
 *                 payloads: true
 *             }
 *         }
 *     }
 * }
 * * @returns {Promise}
 */
ElasticSearchDatabaseConnector.prototype.createTable = function ( mapping ) {
    return new Promise (( inResolve ) => {
        let existsFunc = ( exists ) => {
            if ( exists ) {
                inResolve && inResolve( false );
                return;
            }
            this.client.indices.create({ index: mapping.index }).then(() => {
                this.client.indices.putMapping( mapping ).then(() => {
                    inResolve && inResolve ( true );
                }).error(() => { inResolve && inResolve( false ); })
            }).error(() => { inResolve && inResolve( false ); });
        };

        this.tableExists( mapping.index ).then(( exists ) => { existsFunc( exists ); });
    });
};

ElasticSearchDatabaseConnector.prototype.dropTable = function ( name ) {
    return new Promise (( inResolve ) => {
        this.client.indices.delete({ index: name }).then(( success ) => { inResolve && inResolve( success ); });
    });
};

module.exports = ElasticSearchDatabaseConnector;
