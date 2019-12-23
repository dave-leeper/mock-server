const StringsData = require('../util/strings-en-US');

class Strings {
  do() {
    return new Promise((inResolve) => {
      inResolve && inResolve({ status: 200, viewName: 'strings', viewObject: { title: 'Strings', strings: StringsData } });
    });
  }
}

module.exports = Strings;
