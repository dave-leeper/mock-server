'use strict';

const elasticsearch = require('elasticsearch');

/**
 * Database = N/A
 * Table Definition = Mapping
 * Table = Index/Type
 * @param name - name of the connection.
 * @constructor
 */
function ElasticsearchConnector ( name ) {
    this.name = name;
    this.client = null;
    this.config = null;
}
// https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html

ElasticsearchConnector.prototype.connect = function ( config ) {
    return new Promise (( inResolve, inReject ) => {
        // Elasticsearch mangles configs, so copy it.
        let configCopy = { ...config };
        try {
            this.client = new elasticsearch.Client(configCopy);
            this.config = config;
            inResolve && inResolve( this.client );
        } catch (err) {
            inReject && inReject({ status: false, error: 'Error while connecting.' });
        }
    });
};

ElasticsearchConnector.prototype.ping = function (  )
{
    return new Promise (( inResolve, inReject ) => {
        if (!this.client) {
            inReject && inReject ( { status: "Error", error: 'Null client.' } );
        } else {
            this.client.ping({ requestTimeout: 30000 }, function( error ) {
                if (error) {
                    inResolve && inResolve( false );
                } else {
                    inResolve && inResolve( true );
                }
            });
        }
    });
};

ElasticsearchConnector.prototype.disconnect = function ( ) {
    return new Promise (( inResolve, inReject ) => {
        if (!this.client) {
            inReject && inReject({ status: false, error: 'Null client.' });
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

ElasticsearchConnector.prototype.indexExists = function ( name ) {
    return new Promise (( inResolve, inReject ) => {
        this.client.indices.exists({ index: name })
            .then(( exists ) => { inResolve && inResolve( exists ); })
            .catch(( error ) => { inReject && inReject( { status: false, error: 'Error while checking table.' } )});
    });
};

/**
 * @param index - An object that describes the index. Example:
 * {
 *     index: "test"
 * }
 * @returns {Promise}
 */
ElasticsearchConnector.prototype.createIndex = function ( index ) {
    return new Promise (( inResolve, inReject ) => {
        let createFunc = () => {
            this.client.indices.create({ index: index.index }).then(() => {
                inResolve && inResolve({ status: true });
            }, ( error ) => {
                inReject && inReject({ status: false, error: 'Could not create index.' });
            });
        };
        let existsFunc = ( exists ) => {
            if ( exists ) {
                inReject && inReject({ status: false, error: 'Index already exists.' });
                return;
            }
            createFunc();
        };

        if ( !this.validateIndex( index )) {
            inReject && inReject({ status: false, error: 'Invalid index.' });
            return;
        }
        this.indexExists( index.index ).then(( exists ) => { existsFunc( exists ); });
    });
};

ElasticsearchConnector.prototype.dropIndex = function ( name ) {
    return new Promise (( inResolve, inReject ) => {
        this.client.indices.delete({ index: name }).then(( success ) => {
            inResolve && inResolve( success );
        }, ( error ) => {
            inReject && inReject({ status: false, error: error });
        });
    });
};

/**
 * @param mapping - An object that describes the index mapping. Example:
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
 * @returns {Promise}
 */
ElasticsearchConnector.prototype.createIndexMapping = function ( mapping ) {
    return new Promise (( inResolve, inReject ) => {
        let createMappingFunc = () => {
            this.client.indices.putMapping( mapping ).then(() => {
                inResolve && inResolve ({ status: true });
            }).catch((err) => {
                inReject && inReject({ status: false, error: 'Could not create index mapping.' + err });
            });
        };
        let existsFunc = ( exists ) => {
            if ( !exists ) {
                inReject && inReject({ status: false, error: 'Index does not exist.' });
                return;
            }
            createMappingFunc();
        };

        if ( !this.validateIndex( mapping )) {
            inReject && inReject({ status: false, error: 'Invalid index.' });
            return;
        }
        this.indexExists( mapping.index ).then(( exists ) => { existsFunc( exists ); });
    });
};

ElasticsearchConnector.prototype.validateIndex = function ( mapping ) {
    if (( !mapping )
    || ( !mapping.index )) {
        return false;
    }
    if ('string' !== typeof mapping.index) {
        return false;
    }
    return true;
};

ElasticsearchConnector.prototype.validateMapping = function ( mapping ) {
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

ElasticsearchConnector.prototype.insert = function ( data ) {
    return new Promise (( inResolve, inReject ) => {
        this.client.index( data, (error, response) => {
            if (error) {
                inReject && inReject( { status: false, error: error } );
                return;
            }
            inResolve && inResolve( response );
        })
    });
};

ElasticsearchConnector.prototype.update = function ( data ) {
    return new Promise (( inResolve, inReject ) => {
        this.client.update( data, (error, response) => {
            if (error) {
                inReject && inReject( { status: false, error: error } );
                return;
            }
            inResolve && inResolve( response );
        })
     });
};

ElasticsearchConnector.prototype.delete = function ( data ) {
    return new Promise (( inResolve, inReject ) => {
        this.client.delete( data )
            .then(( success ) => { inResolve && inResolve( success ); })
            .catch((error) => { inReject && inReject( { status: false, error: error } ); });
    });
};

ElasticsearchConnector.prototype.read = function ( whereClause ) {
    return new Promise (( inResolve, inReject ) => {
        this.client.search( whereClause,(error, response) => {
            if (error) {
                inReject && inReject( { status: false, error: error } );
                return;
            }
            inResolve && inResolve( response );
        })
    });
};

module.exports = ElasticsearchConnector;

// GET chapter3/_mapping
// GET chapter3/user/_mapping
// GET chapter3/order/_search?q=iphone
// GET chapter3/order/_search?q=item_title:iphone
