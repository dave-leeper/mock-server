client.delete({
    index: 'myindex',
    type: 'mytype',
    id: '1'
}, function (error, response) {
    // ...
});

client.deleteByQuery({
    index: 'myindex',
    q: 'test'
}, function (error, response) {
    // ...
});

client.deleteByQuery({
    index: 'posts',
    body: {
        query: {
            term: { published: false }
        }
    }
}, function (error, response) {
    // ...
});

