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
        host: "localhost:9200",
        log: "trace"
    }
};
let schema = {
    index: "test",
    type: "document",
    body: {
        properties: {
            title: { "type": "string" },
            content: { "type": "string" },
            suggest: {
                type: "completion",
                analyzer: "simple",
                search_analyzer: "simple"
            }
        }
    }
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
    it ( 'should be able to connect, ping, and disconnect the connection', ( done ) => {
        elasticSearch.connect( configInfo ).then(() => {
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
        elasticSearch.connect(configInfo).then(() => {
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
    it ( 'should validate the mapping.', ( ) => {
        const esdc = new ElasticSearch();
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

    it ( 'should be able to to tell when an index does not exist.', ( done ) => {
        elasticSearch.indexExists( 'JUNK' ).then(( existsResult ) => {
            expect( existsResult ).to.be.equal( false );
            done();
        });
    });

    it ( 'should not delete indexes that do not exist.', ( done ) => {
        elasticSearch.dropIndex( 'JUNK' ).then(( dropResult ) => {
            expect( true ).to.be.equal( false );
        }, ( error ) => {
            expect( error.status ).to.be.equal( false );
            done();
        });
    });

    it ( 'should be able to create an index', ( done ) => {
        elasticSearch.createIndex( schema ).then(( createResult ) => {
            expect( createResult.status ).to.be.equal( true );
            elasticSearch.indexExists( schema.index ).then((existsResult2 ) => {
                expect( existsResult2 ).to.be.equal( true );
                done();
           });
        });
    });

    it ( 'should not create indexes that already exist.', ( done ) => {
        elasticSearch.createIndex( schema ).then(( createResult ) => {
            expect( createResult.status ).to.be.equal( true );
            elasticSearch.createIndex( schema ).then(( createResult2 ) => {
                expect( true ).to.be.equal( false );
            }, ( error ) => {
                done();
            });
        });
    });
});


