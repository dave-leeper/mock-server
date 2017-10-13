//@formatter:off
'use strict';

var chai = require( 'chai' ),
    expect = chai.expect,
    chaiAsPromised = require( 'chai-as-promised' ),
    request = require('request' ),
    mocks = require( '../../services/mocks.js' ),
    utilities = require( '../../util/utilities.js' );

chai.use( chaiAsPromised );

describe( 'user_authorization_GET', function()
{
    before( function( done )
    {
        server.initialize( './test/test-config.json' ).then(() =>
        {
            server.start().then(() =>
            {
                done ();
            });
        });
    });

    after( done =>
    {
        server.stop ( ).then ( ( ) => { done ( ); } );
    } );

    it
    (
        'should get a user authorization',
        function ( done )
        {
            request
            (
                {
                    method: "GET",
                    headers: {'content-type' : 'application/json', 'P3_CREDENTIALS': '{"userId": "user3", "password": "password3", "machineId": "machine1" }'},
                    url:     process.env.P3_REST_SERVER + '/user/authorization'
                },
                function(error, response, body)
                {

                    expect ( error ).to.be.equal ( null );
                    expect ( response.statusCode ).to.be.equal ( 200 );
                    expect ( body ).to.not.be.equal ( null );
                    expect ( body ).to.not.be.equal ( undefined );

                    let oData = utilities.get_object( body );

                    expect ( oData ).to.not.be.equal ( null );
                    expect ( oData ).to.not.be.equal ( undefined );
                    expect ( oData.data ).to.not.be.equal ( null );
                    expect ( oData.data ).to.not.be.equal ( undefined );
                    expect ( oData.data.authCode ).to.not.be.equal ( null );
                    expect ( oData.data.authCode ).to.not.be.equal ( undefined );

                    let oHeaders = {'content-type' : 'application/json'},
                        strAuthCode = '{"authCode":"' + oData.data.authCode + '"}';

                    oHeaders['P3_CREDENTIALS'] = strAuthCode;
                    request
                    (
                        {
                            method: "GET",
                            headers: oHeaders,
                            url:     process.env.P3_REST_SERVER + '/metadata/ALL'
                        },
                        function(error, response, body)
                        {
                            expect ( error ).to.be.equal ( null );
                            expect ( response.statusCode ).to.be.equal ( 200 );
                            done();
                        }
                    );
                }
            );
        }
    );

});


