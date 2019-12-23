/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const ValidationHelper = require('./elasticsearch-validation-helper.js');
const Log = require('../../../util/log.js');

function getQuerySize(req) {
  // eslint-disable-next-line radix
  if (req.query._size) return parseInt(req.query._size);
  return 10;
}

function getQueryFrom(req) {
  if (req.query._from) return parseInt(req.query._from);
  return 0;
}

// http://www.lucenetutorial.com/lucene-query-syntax.html
function getQuery(req) {
  let query = '';
  if ((req.params.id) && (req.params.id !== '_all')) query += `_id:${req.params.id}`;
  for (const term in req.query) {
    if ((term === '_from') || (term === '_size')) continue;
    const value = req.query[term];
    if (query.length > 0) query += ' AND ';
    query += `${term}:'${value}'`;
  }
  query.replace(/ /g, '+');
  return query;
}

function formatQueryResults(results) {
  // https://stackoverflow.com/questions/33834141/elasticsearch-and-nest-why-amd-i-missing-the-id-field-on-a-query
  const newResults = [];
  if ((!results) || (!results.hits) || (!results.hits.hits)) return newResults;
  for (const result in results.hits.hits) {
    const record = results.hits.hits[result]._source;
    record._id = results.hits.hits[result]._id;
    newResults.push(record);
  }
  return newResults;
}

function DataQueryBuilder(builder, databaseConnectionInfo) {
  if (!ValidationHelper.validateBuilder(builder) || !ValidationHelper.validateDatabaseConnectionInfo(databaseConnectionInfo)) return;
  return (req, res, next) => {
    const databaseConnection = ValidationHelper.validateDatabaseConnection(builder, req, res, databaseConnectionInfo);
    if (!databaseConnection) return next && next();
    if (!ValidationHelper.validateParams(builder, req, res)) return next && next();
    const { index } = req.params;
    const { type } = req.params;
    const id = req.params.id.toLowerCase();
    const search = { index, type };
    const query = getQuery(req);

    search.index = index;
    search.type = type;
    search.size = getQuerySize(req);
    search.from = getQueryFrom(req);
    if (query) search.q = query;

    databaseConnection.read(search).then((response) => {
      const success = { status: 'success', data: formatQueryResults(response) };
      res.status(200);
      res.send(JSON.stringify(success));
      next && next();
    }).catch((err) => {
      const error = { message: `Error querying database. ${JSON.stringify(err)}`, error: { status: 500 } };
      if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
      builder.sendErrorResponse(error, res);
      next && next();
    });
  };
}

module.exports = DataQueryBuilder;
