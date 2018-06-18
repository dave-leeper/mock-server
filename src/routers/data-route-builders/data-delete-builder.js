'use strict';
let validateDatabaseConnection = require('./validate-database-connection.js');
let validateParams = require('./validate-params.js');

function DataDeleteBuilder( builder, databaseConnectionInfo )
{
    let deleteDataHandler = (req, res) => {
        let databaseConnection = validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        if (!validateParams(builder, req, res)) return;
        let index = req.params.index;
        let type = req.params.type;
        let id = req.params.id;
        let query = { index: index, type: type, id: id };

        databaseConnection.delete( query ).then(( response ) => {
            const success = {status: "success", operation: "Delete record from " + index};
            res.status(200);
            res.send(JSON.stringify(success));
        }).catch(( err ) => {
            const error = { message: "Error deleting record (index: " + index + ", type: " + type + ", id: " + id + "). " + err.error, error: { status: 500 }};
            builder.sendErrorResponse(error, res);
        });
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
