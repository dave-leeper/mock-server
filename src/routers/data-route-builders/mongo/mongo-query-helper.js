
function MongoQueryHelper() {}

MongoQueryHelper.getQuery = function (req) {
  return req.query;
};

module.exports = MongoQueryHelper;
