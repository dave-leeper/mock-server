const fs = require('fs');

function I18n() {}
I18n.locale = 'en-US';
I18n.strings = require(`./strings-${I18n.locale}`);
I18n.setLocale = function (locale) {
  if (!fs.existsSync(`./strings-${locale}`)) return;
  const strings = require(`./strings-${locale}`);
  if (!strings) return;
  I18n.locale = locale;
  I18n.strings = strings;
};
I18n.get = function (stringId) {
  if ((!Number.isInteger(stringId)) || (stringId < 0) || (stringId >= I18n.strings.length)) return null;
  return I18n.strings[stringId];
};

/**
 * Formats a string in a manner similar to sprintf.
 *
 * @example
 * format('{0} is not {1}! {0} {2}', 'Sale', 'Sail');
 * results in:
 * Sale is not Sail! Sale {2}
 * @param inFormat {String} The format string.
 * @Param ... {String} ALL comma separated list of string parameters used to format the inFormat string.
 * @returns {String} The formatted string.
 */
I18n.format = function (inFormat) {
  if ((!inFormat) || (typeof inFormat !== 'string')) return null;
  const args = arguments;
  const formatted = inFormat.replace(
    /{(\d+)}/g,
    (inMatch, inNumber) => {
      if (typeof args[inNumber] !== 'undefined') return args[inNumber];
      return inMatch;
    },
  );
  return formatted;
};

module.exports = I18n;
