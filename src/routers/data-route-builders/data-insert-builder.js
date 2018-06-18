'use strict';
let validateDatabaseConnection = require('./validate-database-connection.js');
let validateUploadFile = require('./validate-upload-file.js');

function DataInsertBuilder( builder, databaseConnectionInfo )
{
    let insertDataHandler = (req, res) => {
        let databaseConnection = validateDatabaseConnection( builder, res, databaseConnectionInfo );
        if (!databaseConnection) return;
        if (!validateUploadFile(builder, req, res)) return;

        let newData = JSON.parse(req.files.fileUploaded.data.toString());
        let data = { index: newData.index, type: newData.type, id: newData.id, body: newData.data };
        databaseConnection.insert(data).then(( response ) => {
            const success = {status: "success", operation: "Insert data to " + newData.index + "/" + newData.type + "."};
            res.status(201);
            res.send(JSON.stringify(success));
        }).catch(( err ) => {
            const error = { message: "Error inserting record. " + err, error: { status: 500 }};
            builder.sendErrorResponse(error, res);
        });
    };

    return insertDataHandler;
}

module.exports = DataInsertBuilder;
