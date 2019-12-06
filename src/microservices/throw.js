let Files = require('../util/files' );

class Throw {
    do(params) {
        throw Error("ERROR");
    }
}   
module.exports = Throw;
