//@formatter:off
'use strict';

let chai = require( 'chai' ),
    expect = chai.expect,
    MockExpressRouter = require('../../mocks/mock-express-router.js'),
    RouteBuilderMicroservices = require('../../../src/routers/route-builder-microservices.js');
let config = {
    "microservices": [
        {
            "path": "/get_microservice",
            "name": "A microservice",
            "description": "A microservice used for testing",
            "serviceFile": "mocks.js"
        },
        {
            "verb": "OPTIONS",
            "path": "/options_microservice",
            "name": "A microservice",
            "description": "A microservice used for testing",
            "serviceFile": "mocks.js"
        },
        {
            "verb": "POST",
            "path": "/post_microservice",
            "name": "A microservice",
            "description": "A microservice used for testing",
            "serviceFile": "mocks.js"
        },
        {
            "verb": "PUT",
            "path": "/put_microservice",
            "name": "A microservice",
            "description": "A microservice used for testing",
            "serviceFile": "mocks.js"
        },
        {
            "verb": "PATCH",
            "path": "/patch_microservice",
            "name": "A microservice",
            "description": "A microservice used for testing",
            "serviceFile": "mocks.js"
        },
        {
            "verb": "DELETE",
            "path": "/delete_microservice",
            "name": "A microservice",
            "description": "A microservice used for testing",
            "serviceFile": "mocks.js"
        },
    ]
};

let containsPath = (array, path) => {
    for (let loop = 0; loop < array.length; loop++) {
        if (array[loop].path === path) return true;
    }
    return false;
};
let hasHandler = (array, path) => {
    for (let loop = 0; loop < array.length; loop++) {
        if (array[loop].path === path) return !!(array[loop].handler);
    }
    return false;
};

describe( 'As a developer, I need an API for creating database connections', function() {
    before(() => {
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    after(() => {
    });
    it ( 'should not build routes using bad parameters', ( ) => {
        let routeBuilderMicroservices = new RouteBuilderMicroservices();
        let mockExpressRouter = new MockExpressRouter();
        let result = routeBuilderMicroservices.connect( null, null );
        expect(result).to.be.equal(false);
        result = routeBuilderMicroservices.connect( {}, {} );
        expect(result).to.be.equal(false);
        result = routeBuilderMicroservices.connect( mockExpressRouter, {} );
        expect(result).to.be.equal(false);
        result = routeBuilderMicroservices.connect( {}, config );
        expect(result).to.be.equal(false);
    });
    it ( 'should be build routes to handlers based on config information', ( ) => {
        let routeBuilderMicroservices = new RouteBuilderMicroservices();
        let mockExpressRouter = new MockExpressRouter();
        let result = routeBuilderMicroservices.connect( mockExpressRouter, config );
        expect(result).to.be.equal(true);
        expect(mockExpressRouter.gets.length).to.be.equal(1);
        expect(mockExpressRouter.option.length).to.be.equal(1);
        expect(mockExpressRouter.posts.length).to.be.equal(1);
        expect(mockExpressRouter.puts.length).to.be.equal(1);
        expect(mockExpressRouter.patches.length).to.be.equal(1);
        expect(mockExpressRouter.deletes.length).to.be.equal(1);
        expect(containsPath(mockExpressRouter.gets, '/get_microservice')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.option, '/options_microservice')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.posts, '/post_microservice')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.puts, '/put_microservice')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.patches, '/patch_microservice')).to.be.equal(true);
        expect(containsPath(mockExpressRouter.deletes, '/delete_microservice')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.gets, '/get_microservice')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.option, '/options_microservice')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.posts, '/post_microservice')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.puts, '/put_microservice')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.patches, '/patch_microservice')).to.be.equal(true);
        expect(hasHandler(mockExpressRouter.deletes, '/delete_microservice')).to.be.equal(true);
    });
});
