/* eslint-disable no-tabs */
const axios = require('axios').default;
const Log = require('../util/log');

// https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#web-application-flow
// https://github.com/login/oauth/authorize?client_id=c710a4e843af74a2455b&redirect_uri=https://hero-www-server.herokuapp.com/github_callback&scope=repo&state=xyz
// /github_callback?code=dc818ad0bb882076ede4&state=xyz
// clientId: "c710a4e843af74a2455b",
// clientSecret: "d391afcab14db918ee41067cdd777007dda89274",
/*
  POST https://github.com/login/oauth/access_token
  client_id:      string	Required. The client ID you received from GitHub for your GitHub App.
  client_secret:  string	Required. The client secret you received from GitHub for your GitHub App.
  code:	          string	Required. The code you received as a response to Step 1.
  redirect_uri:	  string	          The URL in your application where users are sent after authorization.
  state:          string            The unguessable random string you provided in Step 1.
*/
class GithubCallback {
  do(params) {
    return new Promise((inResolve, inReject) => {
      if (Log.will(Log.ERROR)) Log.error('---------------------->1');
      const { code } = params.query;
      const { state } = params.query;
      if (Log.will(Log.ERROR)) Log.error(`---------------------->2 ${JSON.stringify(params.query)}`);
      if (!code || !state) {
        const queryString = JSON.stringify(params.query);
        const error = `Required fields (code and state) not found. Params are ${queryString}`;
        if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
        inReject && inReject({ status: 400, send: error });
      }
      if (Log.will(Log.ERROR)) Log.error('---------------------->3');
      let url = 'https://github.com/login/oauth/access_token';
      url = `${url}?client_id=c710a4e843af74a2455b`;
      url = `${url}&client_secret=d391afcab14db918ee41067cdd777007dda89274`;
      url = `${url}&code=${code}`;
      url = `${url}&redirect_uri=https://hero-www-server.herokuapp.com/`;
      url = `${url}&state=${state}`;
      if (Log.will(Log.ERROR)) Log.error('---------------------->4');

      axios.post(url)
        .then((response) => {
          if (Log.will(Log.ERROR)) Log.error('---------------------->5');
          Log.error(Log.stringify(response));
          inResolve && inResolve({ status: 200, send: { send: Log.stringify(response) } });
        })
        .catch((err) => {
          if (Log.will(Log.ERROR)) Log.error('---------------------->6');
          const error = `Error retrieving access token. ${JSON.stringify(err)}`;
          if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
          inReject && inReject({ status: 400, send: error });
        });
    });
  }
}
module.exports = GithubCallback;
