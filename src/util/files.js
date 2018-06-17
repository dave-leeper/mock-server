'use strict';

let fs = require("fs");
let path = require("path");

class Files {
    /**
     * Reads a file and returns the contents.
     * @param inFilepath {String} The path to the file.
     * @param inEncoding {String} The file's encoding. Defaults to utf8.
     * @returns {String} Returns a string.
     */
    static readFileSync(inFilepath, inEncoding) {

        if (typeof (inEncoding) == 'undefined') {
            inEncoding = 'utf8';
        }
        return fs.readFileSync(inFilepath, inEncoding);
    }
    /**
     * Reads a BLOB file and returns the contents.
     * @param inFilepath {String} The path to the file.
     * @returns {Buffer} Returns a buffer.
     */
    static readBLOBFileSync(inFilepath) {
        return fs.readFileSync(inFilepath);
    }
    /**
     * Writes a file.
     * @param inFilepath {String} The path to the file.
     * @param inText {String} The file's text.
     * @returns {String} The file's contents.
     */
    static writeFileSync(inFilepath, inText) {
        return fs.writeFileSync(inFilepath, inText);
    }

    /**
     * Determines if a file exists.
     * @param inFilepath {String} The path to the file.
     * @returns {Boolean} True if the file exists, false otherwise.
     */
    static existsSync(inFilepath) {
        return fs.existsSync(inFilepath);
    }

    /**
     * Deletes a file.
     * @param inFilepath {String} The path to the file.
     */
    static deleteSync(inFilepath) {
        fs.unlinkSync(inFilepath);
    }

    /**
     * returns a list of files.
     * @param inFilepath {String} The path to the directory to search.
     * @param inNameMatches {RegExp} Only files that match will be returned. Can be null to skip this check.
     * @param inSkipDirectories {Boolean} If true, no directories are returned in the list.
     * @param inSkipFiles {Boolean} If true, no files are returned in the list.
     */
    static getFileList(inFilepath, inNameMatches, inSkipDirectories, inSkipFiles) {
        let results = [];
        fs.readdirSync(inFilepath).forEach((fileName) => {
            let stat =  fs.statSync(path.join(inFilepath, fileName));
            if (inSkipDirectories && stat && stat.isDirectory()) return;
            if (inSkipFiles && stat && stat.isFile()) return;
            if (inNameMatches && !inNameMatches.test(fileName)) return;
            results.push(fileName);
        });

        return results;
    }
}
module.exports = Files;
