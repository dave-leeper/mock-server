const Log = require('../util/log');
const Registry = require('../util/registry');

class Mocks {
  do(reqInfo) {
    return new Promise((inResolve, inReject) => {
      const serverConfig = Registry.get('ServerConfig');
      if ((!serverConfig) || (!serverConfig.mocks)) {
        const error = { status: 500, send: 'Error looking up mocks.' };
        if (Log.will(Log.ERROR)) Log.error(Log.stringify(error));
        inReject && inReject(error);
        return;
      }
      if (serverConfig.mocks.length === 0) {
        inResolve && inResolve({ status: 200, send: 'There are no mocks.' });
        return;
      }
      const result = [];
      const { mocks } = serverConfig;
      for (let loop = 0; loop < mocks.length; loop++) {
        const mock = mocks[loop];
        result.push({
          path: mock.path,
          response: mock.response,
          responseType: mock.responseType,
        });
      }
      inResolve && inResolve({ status: 200, send: Log.stringify(result) });
    });
  }
}
module.exports = Mocks;
