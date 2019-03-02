//@formatter:off
'use strict';

const chai = require( 'chai' ),
    expect = chai.expect,
    MongoDB = require('../../../src/database/mongodb.js'),
    Registry = require('../../../src/util/registry.js');
const mongodb = new MongoDB();
const testCollection = 'testCollection';
let configInfo = {
    name: "mongodb",
    description: "MongoDB service.",
    databaseConnector: "mongodb.js",
    config: {
        url: 'mongodb://localhost:27017',
        db: 'testdb',
        collections: {
            testCollection: { w: 0 }
        }
    }};
let data = {
    title: "my title",
    content: "my content",
    suggest: "my suggest"
};
let updateData = {
    title: "my updated title",
    content: "my updated content",
    suggest: "my updated suggest"
};
let query = {
    title:'my title'
};
describe( 'As a developer, I need to connect, ping, and disconnect to/from mongodb.', function() {
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
        mongodb.connect( configInfo.config ).then(() => {
            mongodb.ping().then(( pingResult ) => {
                expect( pingResult ).to.be.equal( true );
                mongodb.disconnect().then(() => {
                    mongodb.ping().then(( pingResult2 ) => {
                        expect( pingResult2 ).to.be.equal( false );
                        done();
                    });
                }).catch ((err) => {
                    console.log("Test of mongodb.disconnect() failed. Error: " + JSON.stringify(err));
                    expect( false ).to.be.equal( true );
                });
            });
        });
    });
});

describe( 'As a developer, I need to create, check for the existence of, and drop mongodb collections.', function() {
    before(( done ) => {
        mongodb.connect(configInfo.config).then(() => {
            done();
        });
    });
    beforeEach(( done ) => {
        Registry.unregisterAll();
        mongodb.collectionExists( testCollection ).then(( exits ) => {
            if (!exits) done();
            else mongodb.dropCollection( testCollection ).then(() => {
                done();
            });
        });
    });
    afterEach(() => {
    });
    after(( done ) => {
        mongodb.disconnect().then(() => {
            done();
        });
    });

    it ( 'should create collections (tables).', ( done ) => {
        mongodb.createCollection( testCollection ).then(( createResult ) => {
            expect( createResult.status ).to.be.equal( true );
            done();
        }, ( error ) => {
            expect( false ).to.be.equal( true );
        });
    });

    it ( 'should be able to to tell when a collection exists.', ( done ) => {
        mongodb.createCollection( testCollection ).then(( createResult ) => {
            expect( createResult.status ).to.be.equal( true );
            mongodb.collectionExists( testCollection ).then(( existsResult ) => {
                expect( existsResult ).to.be.equal( true );
                done();
            });
        }, ( error ) => {
            expect( false ).to.be.equal( true );
        });
     });

    it ( 'should be able to to tell when a collection does not exist.', ( done ) => {
        mongodb.collectionExists( 'JUNK' ).then(( existsResult ) => {
            expect( existsResult ).to.be.equal( false );
            done();
        });
    });

    it ( 'should drop collections.', ( done ) => {
        mongodb.createCollection( testCollection ).then(( createResult ) => {
            expect( createResult.status ).to.be.equal( true );
            mongodb.dropCollection( testCollection ).then(( dropResult ) => {
                expect( dropResult.status ).to.be.equal( true );
                done();
            }, ( error ) => {
                expect( false ).to.be.equal( true );
            });
        });
    });

    it ( 'should not drop collections that dont exist.', ( done ) => {
        mongodb.dropCollection( 'JUNK' ).then(( dropResult ) => {
            expect( false ).to.be.equal( true );
        }, ( error ) => {
            expect( error.status ).to.be.equal( false );
            done();
        });
    });
// });

// describe( 'As a developer, I need to perform CRUD operations on the database.', function() {
//     before(( done ) => {
//         mongodb.connect(configInfo.config).then(() => {
//             done();
//         });
//     });
//     beforeEach(( done ) => {
//         Registry.unregisterAll();
//         mongodb.indexExists( schema.index ).then(( exits ) => {
//             if (exits) return done();
//             mongodb.createIndex( schema ).then(( ) => {
//                 mongodb.createIndexMapping( schema ).then(( ) => {
//                     done();
//                 });
//             });
//         });
//     });
//     afterEach(( done ) => {
//         mongodb.indexExists( schema.index ).then(( exits ) => {
//             if (!exits) return done();
//             else mongodb.dropIndex( schema.index ).then(() => {
//                 done();
//             });
//         });
//     });
//     after(( done ) => {
//         mongodb.disconnect().then(() => {
//             done();
//         });
//     });
//     it ( 'should be able to insert records into the database.', ( done ) => {
//         mongodb.insert( data ).then(( result ) => {
//             // expect( result.result ).to.be.equal( 'created' );
//             done();
//         }, ( error ) => {
//             expect( true ).to.be.equal( false );
//         });
//     });
//     it ( 'should be able to query records in the database.', ( done ) => {
//         // TODO: Works when run stand-alone in debugger. Fails when run as a group of tests.
//         // mongodb.insert( data ).then(( result ) => {
//         //     mongodb.read( query ).then(( result ) => {
//         //         expect( result.hits ).to.not.be.null;
//         //         expect( Array.isArray(result.hits.hits) ).to.be.equal( true );
//         //         expect( result.hits.hits.length ).to.be.equal( 1 );
//         //         expect( result.hits.hits[0] ).to.not.be.null;
//         //         expect( result.hits.hits[0]._source ).to.not.be.null;
//         //         expect( result.hits.hits[0]._source.title ).to.be.equal('my title');
//         //         expect( result.hits.hits[0]._source.content ).to.be.equal('my content');
//         //         expect( result.hits.hits[0]._source.suggest ).to.be.equal('my suggest');
//         done();
//         //     }, ( error ) => {
//         //         expect( true ).to.be.equal( false );
//         //     });
//         // }, ( error ) => {
//         //     expect( true ).to.be.equal( false );
//         // });
//     });
//
//     it ( 'should be able to update records in the database.', ( done ) => {
//         mongodb.insert( data ).then(( result ) => {
//             mongodb.update( updateData ).then(( result ) => {
//                 expect( result.result ).to.be.equal( 'updated' );
//                 done();
//             }, ( error ) => {
//                 expect( true ).to.be.equal( false );
//             });
//         }, ( error ) => {
//             expect( true ).to.be.equal( false );
//         });
//     });
//     it ( 'should be able to delete records in the database.', ( done ) => {
//         mongodb.insert( data ).then(( result ) => {
//             mongodb.delete( data ).then(( result ) => {
//                 expect( result.result ).to.be.equal( 'deleted' );
//                 done();
//             }, ( error ) => {
//                 expect( true ).to.be.equal( false );
//             });
//         }, ( error ) => {
//             expect( true ).to.be.equal( false );
//         });
//     });
});

