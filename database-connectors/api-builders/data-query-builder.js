Query keywords:
_all
_size
_from

client.search({
    index: 'twitter',
    type: 'tweets',
    body: {
        query: {
            match: {
                body: 'elasticsearch'
            }
        }
    }
}).then(function (resp) {
    var hits = resp.hits.hits;
}, function (err) {
    console.trace(err.message);
});

"http://localhost:9200/[your_index_name]/_search
{
    "size": [your value] //default 10
    "from": [your start index] //default 0
    "query":
    {
        "match_all": {}
    }
}

search on all documents across all types within the twitter index:
GET /twitter/_search?q=user:kimchy

search within specific types:
GET /twitter/tweet,user/_search?q=user:kimchy

search all tweets with a certain tag across several indices (for example, when each user has his own index):
GET /kimchy,elasticsearch/tweet/_search?q=tag:wow

search all tweets across all available indices using _all placeholder:
GET /_all/tweet/_search?q=tag:wow

search across all indices and all types:
GET /_search?q=tag:wow
