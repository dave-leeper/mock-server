//@formatter:off
'use strict';

var chai = require( 'chai' ),
    expect = chai.expect,
    ElasticSearchDatabaseConnector = require('../../database-connectors/elasticsearch.js');
var config = {
        host: "localhost:9200",
        log: "trace"
    };

describe( 'As a developer, I need to work with elasticsearch.', function()
{
    it ( 'It should connect and disconnect to and from elasticsearch', (done ) => {
        let esdc = new ElasticSearchDatabaseConnector();

        esdc.connect(config).then(( error, client ) => {

            esdc.ping().then(( pingResult ) => {
                expect(pingResult).to.be.equal(true);
                esdc.disconnect().then(( disconnectResult ) => {
                    expect(disconnectResult).to.be.equal(true);
                    done();
                });
            });
        });
    });
});


