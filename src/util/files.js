'use strict';

const fs = require("fs");
const path = require("path");
const lockFile = require('lockfile')
const Log = require('./log' );

class Files {
    /**
     * Reads a file and returns the contents.
     * @param inFilepath {String} The path to the file.
     * @param [inEncoding] {String} The file's encoding. Defaults to utf8.
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
     */
    static writeFileSync(inFilepath, inText) {
        fs.writeFileSync(inFilepath, inText);
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
     * Creates a directory.
     * @param inFilepath {String} The path to the directory.
     * @param inMode {Number} Permissions mask the directory. Example 0777. Optional.
     */
    static createDirSync(inFilepath, inMode) {
        if (!inMode) inMode = "\\00777";
        fs.mkdirSync( inFilepath, { recursive: true, mode : inMode }); 
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

    /**
     * Locks a file and reads it, returning its data.
     * @param inFilepath {String} The path to the file.
     * @param inRetries {int} The number of times to retry if the file is already locked. Defaults to 5.
     * @param inOnSuccess {Function} Callback to invoke after success. Will be passed the data that was read.
     * @param inOnFail {Function} Optional callback to invoke after failure. The generated error will be passed to the callback.
     * @see https://www.npmjs.com/package/lockfile
     */
    static readFileLock(inFilepath, inRetries, inOnSuccess, inOnFail) {
        let options = { retries: ( inRetries? inRetries : 5 )};

        lockFile.lock(inFilepath + ".lock", options, (err) => {
            if (err) {
                
                inOnFail && inOnFail(err);
                return;
            }
    
            let data = Files.readFileSync(inFilepath);
    
            lockFile.unlock(inFilepath + ".lock", (err) => {
                if (err) {
                    inOnFail && inOnFail(err);
                    return;
                }
                inOnSuccess && inOnSuccess(data);
            })
        })
    }

    /**
     * Locks a file and replaces it's contents with the provided string data.
     * @param inFilepath {String} The path to the file.
     * @param inText {String} The data to write to the file.
     * @param inRetries {int} The number of times to retry if the file is already locked. Defaults to 5.
     * @param inOnSuccess {Function} Optional callback to invoke after success.
     * @param inOnFail {Function} Optional callback to invoke after failure. The generated error will be passed to the callback.
     * @see https://www.npmjs.com/package/lockfile
     */
    static writeFileLock(inFilepath, inText, inRetries, inOnSuccess, inOnFail) {
        let options = { retries: ( inRetries? inRetries : 5 )};

        lockFile.lock(inFilepath + ".lock", options, (err) => {
            if (err) {
                inOnFail && inOnFail(err);
                return;
            }
            
            Files.writeFileSync(inFilepath, inText);
            
            lockFile.unlock(inFilepath + ".lock", (err) => {
                if (err) {
                    inOnFail && inOnFail(err);
                    return;
                }
                inOnSuccess && inOnSuccess();
            })
        })
    }
}

module.exports = Files;
