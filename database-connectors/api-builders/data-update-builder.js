client.update({
    index: 'myindex',
    type: 'mytype',
    id: '1',
    body: {
        // put the partial document under the `doc` key
        doc: {
            title: 'Updated'
        }
    }
}, function (error, response) {
    // ...
})

// updateByQuery
// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html