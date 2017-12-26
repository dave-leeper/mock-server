'use strict';

function DataInsertBuilder( routerClass, databaseConnectionInfo )
{
    let insertDataHandler = (req, res) => {
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
            let newData = JSON.parse(req.files.fileUploaded.data.toString());
            let index = req.params.index;
            let type = req.params.type;
            let id = req.params.id;
            let data = {
                index: index,
                type: type,
                id: id,
                body: newData
            };

            databaseConnection.insert(data)
            .then(( response ) => {
                const success = {status: "success", operation: "Insert data to " + index + "/" + type + "."};
                res.status(200);
                res.send(JSON.stringify(success));
            })
            .catch(( err ) => {
                const error = { message: "Error inserting record. " + err.error, error: { status: 500 }};
                routerClass.sendErrorResponse(error, res);
            });
        } catch (err) {
            const error = { message: "Error inserting ElasticSearch data.", error: { status: 500, stack: err.stack }};
            routerClass.sendErrorResponse(error, res);
        }
    };

    return insertDataHandler;
}

module.exports = DataInsertBuilder;
