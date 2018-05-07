'use strict';

function DataUpdateBuilder( routerClass, databaseConnectionInfo )
{
    let updateDataHandler = (req, res) => {
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
            let updateDoc = JSON.parse(req.files.fileUploaded.data.toString());
            let data = {
                index: updateDoc.index,
                type: updateDoc.type,
                id: updateDoc.id,
                body: { doc: updateDoc.data }
            };

            databaseConnection.update(data)
                .then(( response ) => {
                    const success = {status: "success", operation: "Update data for " + updateDoc.index};
                    res.status(200);
                    res.send(JSON.stringify(success));
                })
                .catch(( err ) => {
                    const error = { message: "Error updating record (id: " + updateDoc.id + "). " + JSON.stringify(err), error: { status: 500 }};
                    routerClass.sendErrorResponse(error, res);
                });
        } catch (err) {
            const error = { message: "Error updating ElasticSearch data.", error: { status: 500, stack: err.stack }};
            routerClass.sendErrorResponse(error, res);
        }
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