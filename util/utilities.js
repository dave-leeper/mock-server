'use strict';

var fs = require("fs");

class Utilities {
    /**
     * Reads a file and returns the contents.
     * @param inFilepath {String} The path to the file.
     * @param inEncoding {String} The file's encoding. Defaults to utf8.
     * @returns {String} If the encoding option is specified then this
     * function returns a string. Otherwise it returns a buffer.
     */
    static readFileSync(inFilepath, inEncoding) {

        if (typeof (inEncoding) == 'undefined') {
            inEncoding = 'utf8';
        }
        return fs.readFileSync(inFilepath, inEncoding);
    }

}

module.exports = Utilities;
