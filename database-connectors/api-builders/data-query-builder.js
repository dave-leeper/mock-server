'use strict';

function DataQueryBuilder( routerClass, databaseConnectionInfo )
{
    let queryDataHandler = (req, res) => {
        routerClass.addHeaders(databaseConnectionInfo, res);

        try {
            let databaseConnectionName = databaseConnectionInfo.name;
            if (!databaseConnectionName) {
                const error = { message: "Error connecting to database. No connection name found.", error: { status: 500 }};
                res.status(500);
                res.render("error", error);
                return;
            }
            if ((!req.app)
            || (!req.app.locals)
            || (!req.app.locals.___extra)
            || (!req.app.locals.___extra.databaseConnectionManager))
            {
                const error = { message: "Error connecting to database. No database connection manager found.", error: { status: 500 }};
                routerClass.sendErrorResponse(error, res);
                return;
            }
            let databaseConnection = req.app.locals.___extra.databaseConnectionManager.getConnector( databaseConnectionName );
            if (!databaseConnection) {
                const error = { message: "Error connecting to database. No connection found." + databaseConnectionName, error: { status: 500 }};
                routerClass.sendErrorResponse(error, res);
                return;
            }
            if (req.param.index) {
                const error = { message: "Error, no index name provided.", error: { status: 500 }};
                routerClass.sendErrorResponse(error, res);
                return;
            }
            if (req.param.type) {
                const error = { message: "Error, no data type provided.", error: { status: 500 }};
                routerClass.sendErrorResponse(error, res);
                return;
            }
            if (req.param.id) {
                const error = { message: "Error, no record id provided.", error: { status: 500 }};
                routerClass.sendErrorResponse(error, res);
                return;
            }
            let index = req.params.index;
            let type = req.params.type;
            let id = req.params.id.toLowerCase();
            let search = { index: index, type: type };
            let query = getQuery( req );

            search.index = index;
            search.type = type;
            search.size = getQuerySize( req );
            search.from = getQueryFrom( req );
            if (query) {
                search.q = query;
            }

            databaseConnection.read(search)
                .then(( response ) => {
                    const success = { status: "success", data: formatQueryResults( response )};
                    res.status(200);
                    res.send(JSON.stringify(success));
                })
                .catch(( err ) => {
                    const error = { message: "Error querying database. " + JSON.stringify(err), error: { status: 500 }};
                    routerClass.sendErrorResponse(error, res);
                });
        } catch (err) {
            const error = { message: "Error querying ElasticSearch data.", error: { status: 500, stack: err.stack }};
            routerClass.sendErrorResponse(error, res);
        }
    };

    return queryDataHandler;
}

function getQuerySize( req ) {
    if (req.query._size) {
        return parseInt(req.query._size);
    }
    return 10;
}

function getQueryFrom( req ) {
    if (req.query._from) {
        return parseInt(req.query._from);
    }
    return 0;
}

// http://www.lucenetutorial.com/lucene-query-syntax.html
function getQuery( req ) {
    let query = "";

    if ((req.params.id) && ("_all" !== req.params.id)) {
        query += "_id:" + req.params.id;
    }
    for ( let term in req.query ) {
        if (( "_from" === term ) || ( "_size" === term )) {
            continue;
        }
        let value = req.query[term];
        if ( 0 < query.length ) {
            query += " AND ";
        }
        query += term + ":'" + value + "'";
    }
    query.replace(/ /g, "+")
    return query;
}

function formatQueryResults( results ) {
    let newResults = [];

    if ((!results) || (!results.hits) || (!results.hits.hits)) {
        return newResults;
    }
    for (let result in results.hits.hits) {
        newResults.push(results.hits.hits[result]._source);
    }
    return newResults;
}

module.exports = DataQueryBuilder;
