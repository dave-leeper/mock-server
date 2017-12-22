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
            if ((!req.files)
            || (!req.files.fileUploaded)
            || (!req.files.fileUploaded.data)) {
                const error = { message: "Error, no data file was uploaded.", error: { status: 500 }};
                routerClass.sendErrorResponse(error, res);
                return;
            }
            if (req.param('name')) {
                const error = { message: "Error, no table name provided.", error: { status: 500 }};
                routerClass.sendErrorResponse(error, res);
                return;
            }
            if (req.param('type')) {
                const error = { message: "Error, no data type provided.", error: { status: 500 }};
                routerClass.sendErrorResponse(error, res);
                return;
            }
            if (req.param('id')) {
                const error = { message: "Error, no record id provided.", error: { status: 500 }};
                routerClass.sendErrorResponse(error, res);
                return;
            }
            let index = req.params.index;
            let type = req.params.type;
            let id = req.params.id.toLowerCase();
            let search = { index: index, type: type };

            if ( "_all" !== id) {
                search.id = parseInt(id);
            } else {
                search.size = getQuerySize( req );
                search.from = getQueryFrom( req );
                search.body = getQuery( req );
            }

            databaseConnection.search(search)
                .then(( response ) => {
                    const success = { status: "success", data: response };
                    res.status(200);
                    res.send(JSON.stringify(success));
                },
                function (err) {
                    const error = { message: "Error searching table. " + err.error, error: { status: 500 }};
                    routerClass.sendErrorResponse(error, res);
                });
        } catch (err) {
            const error = { message: "Error inserting ElasticSearch data.", error: { status: 500, stack: err.stack }};
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

function getQuery( req ) {
    if ((!!req.query) || (!req.query.length)) {
        return { "match_all": {}};
    }

    let query = { query: { bool: { must: []}}};
    for ( let term in req.query ) {
        let value = req.query[term];
        let condition = {term: { term: value }};
        query.query.bool.must.push(condition);
    }
    return query;

    // {
    //     "query": {
    //     "bool": {
    //         "must": [
    //             {
    //                 "term": {
    //                     "field1": "X"
    //                 }
    //             },
    //             {
    //                 "term": {
    //                     "field3": "Z"
    //                 }
    //             }
    //         ],
    //             "must_not": {
    //             "term": {
    //                 "field2": "Y"
    //             }
    //         }
    //     }
}

module.exports = DataQueryBuilder;

// Query keywords:
// _all
// _size
// _from
//
// client.search({
//     index: 'twitter',
//     type: 'tweets',
//     body: {
//         query: {
//             match: {
//                 body: 'elasticsearch'
//             }
//         }
//     }
// }).then(function (resp) {
//     var hits = resp.hits.hits;
// }, function (err) {
//     console.trace(err.message);
// });
//
// "http://localhost:9200/[your_index_name]/_search
// {
//     "size": [your value] //default 10
//     "from": [your start index] //default 0
//     "query":
//     {
//         "match_all": {}
//     }
// }
//
// search on all documents across all types within the twitter index:
// GET /twitter/_search?q=user:kimchy
//
// search within specific types:
// GET /twitter/tweet,user/_search?q=user:kimchy
//
// search all tweets with a certain tag across several indices (for example, when each user has his own index):
// GET /kimchy,elasticsearch/tweet/_search?q=tag:wow
//
// search all tweets across all available indices using _all placeholder:
// GET /_all/tweet/_search?q=tag:wow
//
// search across all indices and all types:
// GET /_search?q=tag:wow
//
// function GetQuery( req ) {
//     if (req.param('name')) {
//         const error = { message: "Error, no table name provided.", error: { status: 500 }};
//         routerClass.sendErrorResponse(error, res);
//         return;
//     }
//
// }
