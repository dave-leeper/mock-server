//@formatter:off
'use strict';

const chai = require( 'chai' ),
    expect = chai.expect,
    ElasticSearchDatabaseConnector = require('../../../database-connectors/elasticsearch.js');
const config = {
        host: "localhost:9200",
        log: "trace"
    };
let schema = {
    "index": "test",
    "type": "document",
    "body": {
        "properties": {
            "title": { "type": "string" },
            "content": { "type": "string" },
            "suggest": {
                "type": "completion",
                "analyzer": "simple",
                "search_analyzer": "simple"
            }
        }
    }
};

describe( 'As a developer, I need to connect, ping, and disconnect to/from elasticsearch.', function() {
    it ( 'should connect and disconnect to and from elasticsearch', ( done ) => {
        const esdc = new ElasticSearchDatabaseConnector();

        console.log("=== Attempting to connect to ElasticSearch on localhost:9200. ===");
        esdc.connect( config ).then(( error, client ) => {
            esdc.ping().then(( pingResult ) => {
                expect( pingResult ).to.be.equal( true );
                esdc.disconnect().then(( disconnectResult ) => {
                    expect( disconnectResult ).to.be.equal( true );
                    esdc.ping().then(( pingResult2 ) => {
                        expect( pingResult2 ).to.be.equal( false );
                        done();
                    });
                });
            });
        });

    });
});

describe( 'As a developer, I need to create, check for the existence of, and drop elasticsearch indexes.', function() {

    it ( 'should validate the mapping.', ( ) => {
        const esdc = new ElasticSearchDatabaseConnector();
        expect( esdc.validateMapping()).to.be.equal( false );
        expect( esdc.validateMapping({})).to.be.equal( false );
        expect( esdc.validateMapping({index:""})).to.be.equal( false );
        expect( esdc.validateMapping({index:"",type:""})).to.be.equal( false );
        expect( esdc.validateMapping({index:"",type:"",body:{}})).to.be.equal( false );
        expect( esdc.validateMapping({index:"",type:"",body:{properties:{}}})).to.be.equal( false );
        expect( esdc.validateMapping({index:"",type:"",body:{properties:{"title": { "type": "" }}}})).to.be.equal( false );
        expect( esdc.validateMapping({index:"",type:"",body:{properties:{"title": { "type": "string" }}}})).to.be.equal( false );
        expect( esdc.validateMapping({index:"",type:"document",body:{properties:{"title": { "type": "" }}}})).to.be.equal( false );
        expect( esdc.validateMapping({index:"test",type:"",body:{properties:{"title": { "type": "" }}}})).to.be.equal( false );
        expect( esdc.validateMapping({index:"test",type:"document",body:{properties:{"title": { "type": "" }}}})).to.be.equal( false );
        expect( esdc.validateMapping({index:"test",type:"",body:{properties:{"title": { "type": "string" }}}})).to.be.equal( false );
        expect( esdc.validateMapping({index:{"value": "test"},type:"document",body:{properties:{"title": { "type": "string" }}}})).to.be.equal( false );
        expect( esdc.validateMapping({index:"test",type:{"value": "document"},body:{properties:{"title": { "type": "string" }}}})).to.be.equal( false );
        expect( esdc.validateMapping({index:"test",type:"document",body:{properties:{"title": { "type": {"value": "string"} }}}})).to.be.equal( false );
        expect( esdc.validateMapping({index:"test",type:"document",body:{properties:"properties"}})).to.be.equal( false );
        expect( esdc.validateMapping({index:"test",type:"document",body:"body"})).to.be.equal( false );
        expect( esdc.validateMapping(schema)).to.be.equal( true );
    });

    it ( 'should not create indexes (tables) with invalid mappings.', ( done ) => {
        const esdc = new ElasticSearchDatabaseConnector();
        const invalidSchema = {index:"test",type:"",body:{properties:{"title": { "type": "string" }}}};
        const testFunc = () => {
            esdc.indexExists( invalidSchema.index ).then((existsResult ) => {
                expect( existsResult ).to.be.equal( false );
                esdc.createIndex( invalidSchema ).then((createResult ) => {
                    expect( false ).to.be.equal( true );
                }).catch((error) => {
                    expect( error.status ).to.be.equal( false );
                    done();
                });
            });
        };
        const beforeFunc = () => {
            esdc.connect(config).then(( error, client ) => {
                esdc.indexExists( schema.index ).then((existsResult ) => {
                    if ( existsResult ) {
                        esdc.dropIndex( schema.index ).then((dropResult ) => {
                            testFunc();
                        });
                    } else {
                        testFunc();
                    }
                });
            });
        };

        beforeFunc();
    });

    it ( 'should be able to create, drop, and detect the existence of indexes (tables).', ( done ) => {
        const esdc = new ElasticSearchDatabaseConnector();
        const testFunc = () => {
            esdc.indexExists( schema.index ).then((existsResult ) => {
                expect( existsResult ).to.be.equal( false );
                esdc.createIndex( schema ).then((createResult ) => {
                    expect( createResult.status ).to.be.equal( true );
                    esdc.indexExists( schema.index ).then((existsResult2 ) => {
                        expect( existsResult2 ).to.be.equal( true );
                        esdc.dropIndex( schema.index ).then((dropResult ) => {
                            expect( dropResult.acknowledged ).to.be.equal( true );
                            esdc.indexExists( schema.index ).then((existsResult3 ) => {
                                expect( existsResult3 ).to.be.equal( false );
                                done();
                            });
                        });
                    });
                });
            });
        };
        const beforeFunc = () => {
            esdc.connect(config).then(( error, client ) => {
                esdc.indexExists( schema.index ).then((existsResult ) => {
                    if ( existsResult ) {
                        esdc.dropIndex( schema.index ).then((dropResult ) => {
                            testFunc();
                        });
                    } else {
                        testFunc();
                    }
                });
            });
        };

        beforeFunc();
    });

    it ( 'should not create indexes that already exist.', ( done ) => {
        const esdc = new ElasticSearchDatabaseConnector();
        const testFunc = () => {
            esdc.indexExists( schema.index ).then((existsResult ) => {
                expect( existsResult ).to.be.equal( false );
                esdc.createIndex( schema ).then((createResult ) => {
                    expect( createResult.status ).to.be.equal( true );
                    esdc.indexExists( schema.index ).then((existsResult2 ) => {
                        expect( existsResult2 ).to.be.equal( true );
                        esdc.createIndex( schema ).then((createResult2 ) => {
                            expect( true ).to.be.equal( false );
                        }).catch(() => {
                            esdc.dropIndex( schema.index ).then((dropResult ) => {
                                expect( dropResult.acknowledged ).to.be.equal( true );
                                done();
                            });
                        });
                    });
                });
            });
        };
        const beforeFunc = () => {
            esdc.connect(config).then(( error, client ) => {
                esdc.indexExists( schema.index ).then((existsResult ) => {
                    if ( existsResult ) {
                        esdc.dropIndex( schema.index ).then((dropResult ) => {
                            testFunc();
                        });
                    } else {
                        testFunc();
                    }
                });
            });
        };

        beforeFunc();
    });

    it ( 'should not delete indexes that dont exist.', ( done ) => {
        const esdc = new ElasticSearchDatabaseConnector();
        const testFunc = () => {
            esdc.dropIndex( schema.index ).then((dropResult ) => {
                expect( true ).to.be.equal( false );
            }).catch(( error ) => {
                expect( error.status ).to.be.equal( false );
                done();
            });
        };
        const beforeFunc = () => {
            esdc.connect(config).then(( error, client ) => {
                esdc.indexExists( schema.index ).then((existsResult ) => {
                    if ( existsResult ) {
                        esdc.dropIndex( schema.index ).then((dropResult ) => {
                            testFunc();
                        });
                    } else {
                        testFunc();
                    }
                });
            });
        };

        beforeFunc();
    });
});


