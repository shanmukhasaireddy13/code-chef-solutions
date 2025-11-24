const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
// Use a secure key from env or a default for development (32 bytes)
const key = process.env.ENCRYPTION_KEY
    ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
    : crypto.scryptSync('default_secret_key', 'salt', 32);

const ivLength = 16; // For AES, this is always 16

function encrypt(text) {
    if (!text) return text;
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    if (!text) return text;
    try {
        const textParts = text.split(':');
        // If not in iv:content format, return as is (for backward compatibility)
        if (textParts.length < 2) return text;

        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        // If decryption fails, return original text (might be unencrypted legacy data)
        console.error('Decryption failed:', error.message);
        return text;
    }
}

module.exports = { encrypt, decrypt };
