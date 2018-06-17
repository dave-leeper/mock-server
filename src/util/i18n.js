
class I18n {
    static get(str) {
        return str;
    }
    /**
     * Formats a string in a manner similar to sprintf or Microsoft's String.Format() method.
     *
     * @example
     * format('{0} is not {1}! {0} {2}', 'Sale', 'Sail');
     * results in:
     * Sale is not Sail! Sale {2}
     * @param inFormat {String} The format string.
     * @Param ... {String} ALL comma separated list of string parameters used to format the inFormat string.
     * @returns {String} The formatted string.
     */
    static format ( inFormat ) {
        if (!inFormat) return null;
        let args = arguments;
        let formatted = inFormat.replace(
            /{(\d+)}/g,
            ( inMatch, inNumber ) => {
                if (typeof args[ inNumber ] !== 'undefined') return args[ inNumber ];
                return  inMatch;
            }
        );
        return formatted;
    }
}
module.exports = I18n;
