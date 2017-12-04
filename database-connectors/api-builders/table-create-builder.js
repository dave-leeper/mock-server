'use strict';

function CreateTableBuilder( routerClass, databaseConnectionInfo )
{
    let createTableHandler = (req, res) => {
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
                res.status(500);
                res.render("error", error);
                return;
            }
            let databaseConnection = req.app.locals.___extra.databaseConnectionManager.getConnector( databaseConnectionName );
            if (!databaseConnection) {
                const error = { message: "Error connecting to database. No connection found." + databaseConnectionName, error: { status: 500 }};
                res.status(500);
                res.render("error", error);
                return;
            }
            for (const field in req) {
                console.log("XXXXXXXXXX field: " + field);
            }
            for (const bodyfield in req.body) {
                console.log("XXXXXXXXXX field: " + bodyfield);
            }
            console.log("XXXXXXXXXX req.body: " + JSON.stringify(req.body));
            if ((!req.files)
            || (!req.files.fileUploaded)
            || (!req.files.fileUploaded.data)) {
                const error = { message: "Error, no mapping file was uploaded.", error: { status: 500 }};
                res.status(500);
                res.render("error", error);
                return;
            }

            let mappingData = JSON.parse(req.files.fileUploaded.data.toString());
            databaseConnection.createTable( mappingData )
                .then(() => {
                    const success = {status: "success", operation: "Create table " + mappingData.index};
                    res.status(200);
                    res.send(JSON.stringify(success));
                })
                .catch(( err ) => {
                    const error = { message: "Error creating table. " + err.error, error: { status: 500 }};
                    res.status(500);
                    res.render("error", error);
                });
        } catch (err) {
            const error = { message: "Error uploading ElasticSearch mapping file.", error: { status: 500, stack: err.stack }};
            res.status(500);
            res.render("error", error);
        }
    };

    return createTableHandler;
}

module.exports = CreateTableBuilder;
