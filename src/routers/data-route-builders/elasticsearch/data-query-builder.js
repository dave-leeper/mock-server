'use strict';
let ValidationHelper = require('./elasticsearch-validation-helper.js');
let log = require ( '../../../util/log.js' );

function DataQueryBuilder( builder, databaseConnectionInfo )
{
    if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
    return (req, res, next) => {
        let databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
        if (!databaseConnection) return next && next();
        if (!ValidationHelper.validateParams(builder, req, res)) return next && next();
        let index = req.params.index;
        let type = req.params.type;
        let id = req.params.id.toLowerCase();
        let search = { index: index, type: type };
        let query = getQuery( req );

        search.index = index;
        search.type = type;
        search.size = getQuerySize( req );
        search.from = getQueryFrom( req );
        if (query) search.q = query;

        databaseConnection.read(search).then(( response ) => {
            const success = { status: "success", data: formatQueryResults( response )};
            res.status(200);
            res.send(JSON.stringify(success));
            next && next();
        }).catch(( err ) => {
            const error = { message: "Error querying database. " + JSON.stringify(err), error: { status: 500 }};
            log.error(log.stringify(error));
            builder.sendErrorResponse(error, res);
            next && next();
        });
    };
}

function getQuerySize( req ) {
    if (req.query._size) return parseInt(req.query._size);
    return 10;
}

function getQueryFrom( req ) {
    if (req.query._from) return parseInt(req.query._from);
    return 0;
}

// http://www.lucenetutorial.com/lucene-query-syntax.html
function getQuery( req ) {
    let query = "";
    if ((req.params.id) && ("_all" !== req.params.id)) query += "_id:" + req.params.id;
    for ( let term in req.query ) {
        if (( "_from" === term ) || ( "_size" === term )) continue;
        let value = req.query[term];
        if ( 0 < query.length ) query += " AND ";
        query += term + ":'" + value + "'";
    }
    query.replace(/ /g, "+")
    return query;
}

function formatQueryResults( results ) {
    // https://stackoverflow.com/questions/33834141/elasticsearch-and-nest-why-amd-i-missing-the-id-field-on-a-query
    let newResults = [];
    if ((!results) || (!results.hits) || (!results.hits.hits)) return newResults;
    for (let result in results.hits.hits) {
        let record = results.hits.hits[result]._source;
        record._id = results.hits.hits[result]._id;
        newResults.push( record );
    }
    return newResults;
}

module.exports = DataQueryBuilder;
