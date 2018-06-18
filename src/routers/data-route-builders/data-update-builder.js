'use strict';
let validateDatabaseConnection = require('./validate-database-connection.js');
let validateUploadFile = require('./validate-upload-file.js');

function DataUpdateBuilder( builder, databaseConnectionInfo )
{
    let updateDataHandler = (req, res) => {
        let databaseConnection = validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        if (!validateUploadFile(builder, req, res)) return;

        let updateDoc = JSON.parse(req.files.fileUploaded.data.toString());
        let data = { index: updateDoc.index, type: updateDoc.type, id: updateDoc.id, body: { doc: updateDoc.data }};
        databaseConnection.update(data).then(( response ) => {
            const success = {status: "success", operation: "Update data for " + updateDoc.index};
            res.status(200);
            res.send(JSON.stringify(success));
        }).catch(( err ) => {
            const error = { message: "Error updating record (id: " + updateDoc.id + "). " + JSON.stringify(err), error: { status: 500 }};
            builder.sendErrorResponse(error, res);
        });
    };

    return updateDataHandler;
}

module.exports = DataUpdateBuilder;

// client.update({
//     index: 'myindex',
//     type: 'mytype',
//     id: '1',
//     body: {
//         // put the partial document under the `doc` key
//         doc: {
//             title: 'Updated'
//         }
//     }
// }, function (error, response) {
//     // ...
// })

// updateByQuery
// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html