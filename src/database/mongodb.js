'use strict';

const mongodb = require('mongodb');

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
                inReject && inReject({status: false, error: 'Error while connecting.'});
                return;
            }
            client.connect(config.url, { useNewUrlParser: true }, (err, client) => {
                if (err) {
                    inReject && inReject({status: false, error: 'Error while connecting.'});
                    return;
                }
                self.client = client;
                self.db = client.db(config.db);
                if (!self.db) {
                    inReject && inReject({status: false, error: 'Error while connecting.'});
                    return;
                }
                inResolve && inResolve( this.client );
            });
        } catch (err) {
            inReject && inReject({ status: false, error: 'Error while connecting.' });
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
            inReject && inReject({ status: false, error: 'Null client.' });
        } else {
            try {
                this.client.close();
                this.client = null;
                inResolve && inResolve(true);
            } catch (err) {
                inReject && inReject ( { status: false, error: 'Error while disconnecting. ' + JSON.stringify(err)} );
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
            if (err)
                inReject && inReject({ status: false, error: 'Error while creating collection.' });
            else
                inResolve && inResolve( { status: true } );
        });
    });
};

Mongodb.prototype.dropCollection = function ( name ) {
    return new Promise (( inResolve, inReject ) => {
        this.db.dropCollection(name, null, (err, delOK) => {
            if (err)
                inReject && inReject({ status: false, error: 'Error while dropping collection.' });
            else
                inResolve && inResolve( { status: true } );
        });
    });
};

Mongodb.prototype.insert = function ( name, data ) {
    return new Promise (( inResolve, inReject ) => {
        this.db.collection(name).insertOne(data, (err, insOK) => {
            if (err)
                inReject && inReject({ status: false, error: 'Error while inserting data.' });
            else
                inResolve && inResolve( this.client );
        });
    });
};

Mongodb.prototype.update = function ( name, query, data ) {
    return new Promise (( inResolve, inReject ) => {
        this.db.collection(name).updateOne(query, data, (err, updOK) => {
            if (err)
                inReject && inReject({ status: false, error: 'Error while updating data.' });
            else
                inResolve && inResolve( this.client );
        });
    });
};

Mongodb.prototype.delete = function ( name, query ) {
    return new Promise (( inResolve, inReject ) => {
        this.db.collection(name).deleteOne(query, (err, delOK) => {
            if (err)
                inReject && inReject({ status: false, error: 'Error while deleting data.' });
            else
                inResolve && inResolve( this.client );
        });
    });
};

Mongodb.prototype.read = function ( name, query ) {
    return new Promise (( inResolve, inReject ) => {
        this.db.collection(name).find(query).toArray((err, result) => {
            if (err)
                inReject && inReject({ status: false, error: 'Error while querying data.' });
            else
                inResolve && inResolve( result );
        });
    });
};

module.exports = Mongodb;
