//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    DatabaseConnectorManager = require('../../database-connectors/database-connector-manager.js');
let config = {
    databaseConnections : [
        {
            name: "elasticsearch",
            description: "Elasticsearch service.",
            databaseConnector: "elasticsearch.js",
            config: {
                host: "localhost:9200",
                log: "trace"
            }
        }
    ]
};

describe( 'As a developer, I need to manage database connections.', function()
{
    it ( 'It should create all requested database connections', ( done ) => {
        let dcm = new DatabaseConnectorManager();

        expect(dcm).to.not.be.null;
        console.log("=== Attempting to connect to ElasticSearch on localhost.");
        dcm.connect(config).then ((error, param2) => {
            expect(dcm.config).to.be.equal(config);
            expect(dcm.databaseConnectors.length).to.be.equal(1);

            let elasticSearchDC = dcm.getConnector("elasticsearch");
            expect(elasticSearchDC).to.not.be.null;
            dcm.disconnect().then(() => {
                done();
            });
        });
    });
});


