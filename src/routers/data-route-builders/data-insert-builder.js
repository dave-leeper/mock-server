'use strict';
let Registry = require ( '../../util/registry.js' );

function DataInsertBuilder( builder, databaseConnectionInfo )
{
    let insertDataHandler = (req, res) => {
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
            if ((!req.files)
            || (!req.files.fileUploaded)
            || (!req.files.fileUploaded.data)) {
                const error = { message: "Error, no data file was uploaded.", error: { status: 500 }};
                builder.sendErrorResponse(error, res);
                return;
            }
            let newData = JSON.parse(req.files.fileUploaded.data.toString());
            let data = {
                index: newData.index,
                type: newData.type,
                id: newData.id,
                body: newData.data
            };

            databaseConnection.insert(data)
                .then(( response ) => {
                    const success = {status: "success", operation: "Insert data to " + newData.index + "/" + newData.type + "."};
                    res.status(201);
                    res.send(JSON.stringify(success));
                })
                .catch(( err ) => {
                    const error = { message: "Error inserting record. " + err, error: { status: 500 }};
                    builder.sendErrorResponse(error, res);
                });
        } catch (err) {
            const error = { message: "Error inserting ElasticSearch data.", error: { status: 500, stack: err.stack }};
            builder.sendErrorResponse(error, res);
        }
    };

    return insertDataHandler;
}

module.exports = DataInsertBuilder;
