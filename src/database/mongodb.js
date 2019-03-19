'use strict';

const mongodb = require('mongodb');
let log = require ( '../util/log.js' );

/**
 * @param name - name of the connection.
 * @constructor
 */
function Mongodb ( name ) {
    this.name = name;
    this.client = null;
    this.db = null;
    this.config = null;
}

/**
 * @param config - database config.
 * @constructor
 */
Mongodb.prototype.connect = function (config ) {
    let self = this;
    return new Promise (( inResolve, inReject ) => {
        try {
            let client = mongodb.MongoClient;;
            this.config = config;
            if (!config || !config.url || !config.db) {
                let error = {status: false, error: 'Error while connecting.'};
                log.error(log.stringify(error));
                inReject && inReject( error );
                return;
            }
            client.connect(config.url, { useNewUrlParser: true }, (err, client) => {
                if (err) {
                    let error = { status: false, error: 'Error while connecting.' }
                    log.error(log.stringify(error));
                    inReject && inReject(error);
                    return;
                }
                self.client = client;
                self.db = client.db(config.db);
                if (!self.db) {
                    let error = { status: false, error: 'Error while connecting.' }
                    log.error(log.stringify(error));
                    inReject && inReject(error);
                    return;
                }
                inResolve && inResolve( this.client );
            });
        } catch (err) {
            let error = { status: false, error: 'Error while connecting.' }
            log.error(log.stringify(error));
            inReject && inReject(error);
        }
    });
};

Mongodb.prototype.ping = function (  ) {
    return new Promise (( inResolve, inReject ) => {
        if (!this.client || !this.db) {
            inResolve && inResolve( false );
            return;
        }
        const admin = this.db.admin();
        admin.ping(null, ( error, result ) => {
            if (error) {
                inResolve && inResolve( false );
            } else {
                inResolve && inResolve( true );
            }
        });
    });
};

Mongodb.prototype.disconnect = function ( ) {
    return new Promise (( inResolve, inReject ) => {
        if (!this.client) {
            let error = { status: false, error: 'Null client.' };
            log.error(log.stringify(error));
            inReject && inReject( error );
        } else {
            try {
                this.client.close();
                this.client = null;
                inResolve && inResolve(true);
            } catch (err) {
                let error = { status: false, error: 'Error while disconnecting. ' + JSON.stringify(err)};
                log.error(log.stringify(error));
                inReject && inReject(error);
            }
        }
    });
};

Mongodb.prototype.collectionExists = function ( name ) {
    return new Promise (( inResolve, inReject ) => {
        this.db.collections( null, (err, collections) => {
            for (let loop = 0; loop < collections.length; loop++) {
                if (collections[loop] && collections[loop].collectionName === name) {
                    inResolve && inResolve(true);
                    return;
                }
            }
            inResolve && inResolve( false );
        });
    });
};

/**
 * @param name - The collection name.
 * @returns {Promise}
 */
Mongodb.prototype.createCollection = function ( name ) {
    return new Promise (( inResolve, inReject ) => {
        let config = (this.config && this.config.collections && this.config.collections[name])? this.config.collections[name] : null ;
        this.db.createCollection(name, config, (err, results) => {
            if (err) {
                let error = {status: false, error: 'Error while creating collection.'};
                log.error(log.stringify(error));
                inReject && inReject( error );
            }
            else
                inResolve && inResolve( { status: true } );
        });
    });
};

Mongodb.prototype.dropCollection = function ( name ) {
    return new Promise (( inResolve, inReject ) => {
        this.db.dropCollection(name, null, (err, delOK) => {
            if (err) {
                let error = {status: false, error: 'Error while dropping collection.'};
                log.error(log.stringify(error));
                inReject && inReject( error );
            }
            else
                inResolve && inResolve( { status: true } );
        });
    });
};

Mongodb.prototype.insert = function ( name, data ) {
    return new Promise (( inResolve, inReject ) => {
        this.db.collection(name).insertOne(data, (err, insOK) => {
            if (err) {
                let error = {status: false, error: 'Error while inserting data.'};
                log.error(log.stringify(error));
                inReject && inReject( error );
            }
            else {
                inResolve && inResolve( { status: true, returnValue: insOK } );
            }
        });
    });
};

Mongodb.prototype.update = function ( name, query, data ) {
    return new Promise (( inResolve, inReject ) => {
        let updateOptions = {
            returnOriginal: false,
            upsert: false
        };
        this.db.collection(name).findOneAndUpdate(query, { $set: data }, updateOptions, (err, updOK) => {
            if (err) {
                let error = {status: false, error: 'Error while updating data.'};
                log.error(log.stringify(error));
                inReject && inReject( error );
            }
            else
                inResolve && inResolve( { status: true } );
        });
    });
};

Mongodb.prototype.delete = function ( name, query ) {
    return new Promise (( inResolve, inReject ) => {
        this.db.collection(name).findOneAndDelete(query, (err, delOK) => {
            if (err) {
                let error = {status: false, error: 'Error while deleting data.'};
                log.error(log.stringify(error));
                inReject && inReject( error );
            }
            else
                inResolve && inResolve( { status: true } );
        });
    });
};

Mongodb.prototype.read = function ( name, query ) {
    return new Promise (( inResolve, inReject ) => {
        this.db.collection(name).find(query).toArray((err, result) => {
            if (err) {
                let error = {status: false, error: 'Error while querying data.'};
                log.error(log.stringify(error));
                inReject && inReject( error );
            }
            else
                inResolve && inResolve( result );
        });
    });
};

module.exports = Mongodb;
