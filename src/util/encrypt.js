const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

function Encrypt(){};
Encrypt.key = crypto.randomBytes(32);
Encrypt.iv = crypto.randomBytes(16);

Encrypt.encrypt = function (text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(Encrypt.key), Encrypt.iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: Encrypt.iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

Encrypt.decrypt = function (text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(Encrypt.key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = Encrypt;