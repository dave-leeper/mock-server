'use strict';
let Registry = require ( '../../util/registry.js' );

function DataDeleteBuilder( builder, databaseConnectionInfo )
{
    let deleteDataHandler = (req, res) => {
        builder.addHeaders(databaseConnectionInfo, res);
        builder.addCookies(databaseConnectionInfo, res);

        try {
            let databaseConnectionName = databaseConnectionInfo.name;
            if (!databaseConnectionName) {
                const error = { message: "Error connecting to database. No connection name found.", error: { status: 500 }};
                res.status(500);
                res.render("error", error);
                return;
            }
            let databaseConnectionManager = Registry.get('DatabaseConnectorManager');
            if (!databaseConnectionManager) {
                const error = { message: "Error connecting to database. No database connection manager found.", error: { status: 500 }};
                builder.sendErrorResponse(error, res);
                return;
            }
            let databaseConnection = databaseConnectionManager.getConnection( databaseConnectionName );
            if (!databaseConnection) {
                const error = { message: "Error connecting to database. No connection found." + databaseConnectionName, error: { status: 500 }};
                builder.sendErrorResponse(error, res);
                return;
            }
            if (!req.params.index) {
                const error = { message: "Error, no index name provided.", error: { status: 500 }};
                builder.sendErrorResponse(error, res);
                return;
            }
            if (!req.params.type) {
                const error = { message: "Error, no data type provided.", error: { status: 500 }};
                builder.sendErrorResponse(error, res);
                return;
            }
            if (!req.params.id) {
                const error = { message: "Error, no record id provided.", error: { status: 500 }};
                builder.sendErrorResponse(error, res);
                return;
            }
            let index = req.params.index;
            let type = req.params.type;
            let id = req.params.id;
            let query = {
                index: index,
                type: type,
                id: id
            };

            databaseConnection.delete( query )
                .then(( response ) => {
                    const success = {status: "success", operation: "Delete record from " + index};
                    res.status(200);
                    res.send(JSON.stringify(success));
                })
                .catch(( err ) => {
                    const error = { message: "Error deleting record (index: " + index + ", type: " + type + ", id: " + id + "). " + err.error, error: { status: 500 }};
                    builder.sendErrorResponse(error, res);
                });
        } catch (err) {
            const error = { message: "Error deleting ElasticSearch data.", error: { status: 500, stack: err.stack }};
            builder.sendErrorResponse(error, res);
        }
    };

    return deleteDataHandler;
}

module.exports = DataDeleteBuilder;

// module.exports = DataDeleteBuilder;
// client.delete({
//     index: 'myindex',
//     type: 'mytype',
//     id: '1'
// }, function (error, response) {
//     // ...
// });
//
// client.deleteByQuery({
//     index: 'myindex',
//     q: 'test'
// }, function (error, response) {
//     // ...
// });
//
// client.deleteByQuery({
//     index: 'posts',
//     body: {
//         query: {
//             term: { published: false }
//         }
//     }
// }, function (error, response) {
//     // ...
// });
//
