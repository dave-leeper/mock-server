'use strict';

function CreateTableBuilder( routerClass, databaseConnectionInfo )
{
    let createTableHandler = (req, res) => {
        routerClass.addHeaders(databaseConnectionInfo, res);

        if ((!req)
        || (!req.app)
        || (!req.app.locals)
        || (!req.app.locals.___extra)
        || (!req.app.locals.___extra.databaseConnectionManager)) {
            res.render("error", {message: "No database connection manager.", error: {status: 500}});
            return;
        }
        let databaseConnectionManager = req.app.locals.___extra.databaseConnectionManager;
        let databaseConnection = databaseConnectionManager.getConnector(databaseConnectionInfo.name);
        if (!databaseConnection) {
            res.render("error", {message: "No database connection.", error: {status: 500}});
            return;
        }

        try {
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldname, file, filename) {
                file.on('end', function () {
                    databaseConnection.createTable(file).then((createResult) => {
                        if (createResult) {
                            res.send({created: createResult});
                        } else {
                            res.render("error", {
                                message: "Error creating table.",
                                error: {status: 500, stack: null}
                            });
                        }
                    }).catch((err) => {
                        res.render("error", { message: "Error creating table.", error: { status: 500, stack: JSON.stringify( file )}});
                    });
                });
            });
        } catch (err) {
            res.render("error", { message: "Error creating table.", error: {status: 500, stack: err.stack}});
        }
    };

    return createTableHandler;
}

module.exports = CreateTableBuilder;
