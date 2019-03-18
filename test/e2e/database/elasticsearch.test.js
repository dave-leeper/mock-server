//@formatter:off
'use strict';

const chai = require( 'chai' ),
    expect = chai.expect,
    ElasticSearch = require('../../../src/database/elasticsearch.js'),
    Registry = require('../../../src/util/registry.js');
const elasticSearch = new ElasticSearch();
let configInfo = {
    name: "elasticsearch",
    description: "Elasticsearch service.",
    databaseConnector: "elasticsearch.js",
    config: {
        host: "127.0.0.1:9200",
        log: "trace"
    }
};
let schema = {
    index: "test",
    type: "document",
    body: {
        properties: {
            title: { "type": "text" },
            content: { "type": "text" },
            suggest: {
                type: "completion",
                analyzer: "simple",
                search_analyzer: "simple"
            }
        }
    }
};
let data = {
    body:{
        title: "my title",
        content: "my content",
        suggest: "my suggest"
    },
    id: 1,
    type: "document",
    index: "test"
};
let updateData = {
    body:{
        doc: {
            title: "my updated title",
            content: "my updated content",
            suggest: "my updated suggest"
        }
    },
    id: 1,
    type: "document",
    index: "test"
};
let query = {
    index: 'test',
    q: 'title:\'my title\''
};
let query2 = {
    index: 'test',
    q: 'title:\'my updated title\''
};
describe( 'As a developer, I need to connect, ping, and disconnect to/from elasticsearch.', function() {
    before(() => {
    });
    beforeEach(() => {
        Registry.unregisterAll();
    });
    afterEach(() => {
    });
    after(() => {
    });
    it ( 'should be able to connect, ping, and disconnect the elasticsearch connection', ( done ) => {
        elasticSearch.connect( configInfo.config ).then(() => {
            elasticSearch.ping().then(( pingResult ) => {
                expect( pingResult ).to.be.equal( true );
                elasticSearch.disconnect().then(() => {
                    elasticSearch.ping().then(( pingResult2 ) => {
                        expect( pingResult2 ).to.be.equal( false );
                        done();
                    });
                });
            });
        });
    });
});

describe( 'As a developer, I need to create, check for the existence of, and drop elasticsearch indexes.', function() {
    before(( done ) => {
        elasticSearch.connect(configInfo.config).then(() => {
            done();
        });
    });
    beforeEach(( done ) => {
        Registry.unregisterAll();
        elasticSearch.indexExists( schema.index ).then(( exits ) => {
            if (!exits) done();
            else elasticSearch.dropIndex( schema.index ).then(() => {
                done();
            });
        });
    });
    afterEach(() => {
    });
    after(( done ) => {
        elasticSearch.disconnect().then(() => {
            done();
        });
    });

    it ( 'should not create indexes (tables) with invalid elasticsearch mappings.', ( done ) => {
        const invalidSchema = {index:"test",type:"",body:{properties:{"title": { "type": "string" }}}};
        elasticSearch.createIndex( invalidSchema ).then(( createResult ) => {
            expect( createResult.status ).to.be.equal( true );
            elasticSearch.createIndexMapping( invalidSchema ).then(( createResult ) => {
                expect( false ).to.be.equal( true );
            }, ( error ) => {
                done();
            });
        }, ( error ) => {
            expect( false ).to.be.equal( true );
        });
    });

    it ( 'should create indexes (tables) with valid elasticsearch mappings.', ( done ) => {
        elasticSearch.createIndex( schema ).then(( createResult ) => {
            expect( createResult.status ).to.be.equal( true );
            elasticSearch.createIndexMapping( schema ).then(( createResult ) => {
                expect( createResult.status ).to.be.equal( true );
                done();
            }, ( error ) => {
                expect( false ).to.be.equal( true );
                done();
            });
        }, ( error ) => {
            expect( false ).to.be.equal( true );
            done();
        });
    });

    it ( 'should be able to to tell when an index does not exist in elasticsearch.', ( done ) => {
        elasticSearch.indexExists( 'JUNK' ).then(( existsResult ) => {
            expect( existsResult ).to.be.equal( false );
            done();
        });
    });

    it ( 'should not delete indexes that do not existing elasticsearch.', ( done ) => {
        elasticSearch.dropIndex( 'JUNK' ).then(( dropResult ) => {
            expect( true ).to.be.equal( false );
        }, ( error ) => {
            expect( error.status ).to.be.equal( false );
            done();
        });
    });

    it ( 'should be able to create an indexin elasticsearch', ( done ) => {
        elasticSearch.createIndex( schema ).then(( createResult ) => {
            expect( createResult.status ).to.be.equal( true );
            elasticSearch.indexExists( schema.index ).then((existsResult2 ) => {
                expect( existsResult2 ).to.be.equal( true );
                done();
           });
        });
    });

    it ( 'should not create indexes that already exist in elasticsearch.', ( done ) => {
        elasticSearch.createIndex( schema ).then(( createResult ) => {
            expect( createResult.status ).to.be.equal( true );
            elasticSearch.createIndex( schema ).then(( createResult2 ) => {
                expect( true ).to.be.equal( false );
            }, ( error ) => {
                done();
            });
        });
    }).timeout(5000);
});
describe( 'As a developer, I need to perform CRUD operations on the elasticsearch database.', function() {
    before(( done ) => {
        elasticSearch.connect(configInfo.config).then(() => {
            done();
        });
    });
    beforeEach(( done ) => {
        Registry.unregisterAll();
        elasticSearch.indexExists( schema.index ).then(( exits ) => {
            if (exits) return done();
            elasticSearch.createIndex( schema ).then(( ) => {
                elasticSearch.createIndexMapping( schema ).then(( ) => {
                    done();
                });
            });
        });
    });
    afterEach(( done ) => {
        elasticSearch.indexExists( schema.index ).then(( exits ) => {
            if (!exits) return done();
            else elasticSearch.dropIndex( schema.index ).then(() => {
                done();
            });
        });
    });
    after(( done ) => {
        elasticSearch.disconnect().then(() => {
            done();
        });
    });
    it ( 'should be able to insert records into the elasticsearch database.', ( done ) => {
        elasticSearch.insert( data ).then(( result ) => {
            expect( result._index ).to.be.equal( 'test' );
            expect( result._type ).to.be.equal( 'document' );
            expect( result._id ).to.be.equal( '1' );
            expect( result._version ).to.be.equal( 1 );
            expect( result.result ).to.be.equal( 'created' );
            done();
        }, ( error ) => {
            expect( true ).to.be.equal( false );
        });
    });
    it ( 'should be able to query records in the elasticsearch database.', ( done ) => {
        elasticSearch.insert( data ).then(( result ) => {
            expect( result._index ).to.be.equal( 'test' );
            expect( result._type ).to.be.equal( 'document' );
            expect( result._id ).to.be.equal( '1' );
            expect( result._version ).to.be.equal( 1 );
            expect( result.result ).to.be.equal( 'created' );
            elasticSearch.read( query ).then(( result2 ) => {
                expect( result2.hits ).to.not.be.null;
                expect( Array.isArray(result2.hits.hits) ).to.be.equal( true );
                expect( result2.hits.hits.length ).to.be.equal( 1 );
                expect( result2.hits.hits[0] ).to.not.be.null;
                expect( result2.hits.hits[0]._source ).to.not.be.null;
                expect( result2.hits.hits[0]._source.title ).to.be.equal('my title');
                expect( result2.hits.hits[0]._source.content ).to.be.equal('my content');
                expect( result2.hits.hits[0]._source.suggest ).to.be.equal('my suggest');
                done();
            }, ( error ) => {
                expect( true ).to.be.equal( false );
            });
        }, ( error ) => {
            expect( true ).to.be.equal( false );
        });
    });

    it ( 'should be able to update records in the elasticsearch database.', ( done ) => {
        elasticSearch.insert( data ).then(( result ) => {
            elasticSearch.update( updateData ).then(( result2 ) => {
                expect( result2.result ).to.be.equal( 'updated' );
                elasticSearch.read( query2 ).then(( result3 ) => {
                    expect( result3.hits ).to.not.be.null;
                    expect( Array.isArray(result3.hits.hits) ).to.be.equal( true );
                    expect( result3.hits.hits.length ).to.be.equal( 1 );
                    expect( result3.hits.hits[0] ).to.not.be.null;
                    expect( result3.hits.hits[0]._source ).to.not.be.null;
                    expect( result3.hits.hits[0]._source.title ).to.be.equal('my updated title');
                    expect( result3.hits.hits[0]._source.content ).to.be.equal('my updated content');
                    expect( result3.hits.hits[0]._source.suggest ).to.be.equal('my updated suggest');
                    done();
                }, ( error ) => {
                    expect( true ).to.be.equal( false );
                });
            }, ( error ) => {
                expect( true ).to.be.equal( false );
            });
        }, ( error ) => {
            expect( true ).to.be.equal( false );
        });
    });
    it ( 'should be able to delete records in the elasticsearch database.', ( done ) => {
        elasticSearch.insert( data ).then(( result ) => {
            elasticSearch.delete( data ).then(( result2 ) => {
                expect( result2.result ).to.be.equal( 'deleted' );
                elasticSearch.read( query ).then(( result3 ) => {
                    expect( result3.hits ).to.not.be.null;
                    expect( Array.isArray(result3.hits.hits) ).to.be.equal( true );
                    expect( result3.hits.hits.length ).to.be.equal( 0 );
                    done();
                }, ( error ) => {
                    expect( true ).to.be.equal( false );
                });
            }, ( error ) => {
                expect( true ).to.be.equal( false );
            });
        }, ( error ) => {
            expect( true ).to.be.equal( false );
        });
    });
});

