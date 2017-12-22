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
    return new Promise (( inResolve, inReject ) => {
        // Elasticsearch mangles configs, so copy it.
        let configCopy = {};
        let prop;

        for (prop in config.config) {
            configCopy[prop] = config.config[prop];
        }
        try {
            this.client = new elasticsearch.Client(configCopy);
            this.config = config;
            inResolve && inResolve ( null, this.client );
        } catch (err) {
            inReject && inReject ( { status: false, error: 'Error while connecting.' } );
        }
    });
};

ElasticSearchDatabaseConnector.prototype.ping = function (  )
{
    return new Promise (( inResolve, inReject ) => {
        if (!this.client) {
            inReject && inReject ( { status: "Error", error: 'Null client.' } );
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
    return new Promise (( inResolve, inReject ) => {
        if (!this.client) {
            inReject && inReject ( { status: false, error: 'Null client.' } );
        } else {
            try {
                this.client.close();
                inResolve && inResolve(true);
            } catch (err) {
                inReject && inReject ( { status: false, error: 'Error while disconnecting.' } );
            }
        }
    });
};

ElasticSearchDatabaseConnector.prototype.tableExists = function ( name ) {
    return new Promise (( inResolve, inReject ) => {
        this.client.indices.exists({ index: name })
            .then(( exists ) => { inResolve && inResolve( exists ); })
            .catch(( error ) => { inReject && inReject( { status: false, error: 'Error while checking table.' } )});
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
 *                 search_analyzer: "simple"
 *             }
 *         }
 *     }
 * }
 * * @returns {Promise}
 */
ElasticSearchDatabaseConnector.prototype.createTable = function ( mapping ) {
    return new Promise (( inResolve, inReject ) => {
        let createFunc = () => {
            this.client.indices.create({ index: mapping.index }).then(() => {
                this.client.indices.putMapping( mapping ).then(() => {
                    inResolve && inResolve ( { status: true } );
                }).catch(() => { inReject && inReject( { status: false, error: 'Could not add mapping.' } ); })
            }).catch(() => { inReject && inReject( { status: false, error: 'Could not create index.' } ); });
        };
        let existsFunc = ( exists ) => {
            if ( exists ) {
                inReject && inReject({ status: false, error: 'Index already exists.' });
                return;
            }
            createFunc();
        };

        if ( !this.validateMapping( mapping )) {
            inReject && inReject({ status: false, error: 'Invalid mapping.' });
            return;
        }
        this.tableExists( mapping.index ).then(( exists ) => { existsFunc( exists ); });
    });
};

ElasticSearchDatabaseConnector.prototype.dropTable = function ( name ) {
    return new Promise (( inResolve, inReject ) => {
        this.client.indices.delete({ index: name })
            .then(( success ) => { inResolve && inResolve( success ); })
            .catch(() => { inReject && inReject( { status: false, error: 'Index does not exist.' } ); });
    });
};

ElasticSearchDatabaseConnector.prototype.validateMapping = function ( mapping ) {
    if (( !mapping )
    || ( !mapping.index )
    || ( !mapping.type )
    || ( !mapping.body )
    || ( !mapping.body.properties )) {
        return false;
    }
    if (('string' !== typeof mapping.index)
    || ('string' !== typeof mapping.type)
    || ('object' !== typeof mapping.body)
    || ('object' !== typeof mapping.body.properties)) {
        return false;
    }
    for ( let prop in mapping.body.properties ) {
        if ( !mapping.body.properties[prop].type ) {
            return false;
        }
        if ( 'string' !== typeof mapping.body.properties[prop].type ) {
            return false;
        }
    }
    return true;
};

ElasticSearchDatabaseConnector.prototype.insert = function ( data ) {
    return new Promise (( inResolve, inReject ) => {
        this.client.indices.delete({ index: name })
            .then(( success ) => { inResolve && inResolve( success ); })
            .catch(() => { inReject && inReject( { status: false, error: 'Index does not exist.' } ); });
    });
};

ElasticSearchDatabaseConnector.prototype.update = function ( data, whereClause ) {
    return new Promise (( inResolve, inReject ) => {
        this.client.indices.delete({ index: name })
            .then(( success ) => { inResolve && inResolve( success ); })
            .catch(() => { inReject && inReject( { status: false, error: 'Index does not exist.' } ); });
    });
};

ElasticSearchDatabaseConnector.prototype.delete = function ( data, whereClause ) {
    return new Promise (( inResolve, inReject ) => {
        this.client.indices.delete({ index: name })
            .then(( success ) => { inResolve && inResolve( success ); })
            .catch(() => { inReject && inReject( { status: false, error: 'Index does not exist.' } ); });
    });
};

ElasticSearchDatabaseConnector.prototype.read = function ( whereClause ) {
    return new Promise (( inResolve, inReject ) => {
        this.client.indices.delete({ index: name })
            .then(( success ) => { inResolve && inResolve( success ); })
            .catch(() => { inReject && inReject( { status: false, error: 'Index does not exist.' } ); });
    });
};

module.exports = ElasticSearchDatabaseConnector;

// GET chapter3/_mapping
// GET chapter3/user/_mapping
// GET chapter3/order/_search?q=iphone
// GET chapter3/order/_search?q=item_title:iphone
