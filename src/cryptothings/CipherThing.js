import {scrypt, randomFill, createCipheriv, createDecipheriv, pbkdf2, randomBytes} from 'crypto'


async function genRandomBytes(length) {
    return new Promise((resolve, reject) => {
        randomBytes(length, (err, buf) => {
            if (err) reject(err);
            resolve(buf);
        });
    })
}


async function hash(data, iterations, salt) {
    const keylen = 32;
    const method = 'sha512';

    return new Promise((resolve, reject) => {
        pbkdf2(data, salt, iterations, keylen, method, (err, key) => {
            if (err) reject(err);
            resolve(key);
        })
    })
}


async function genRandomKey(length) {
    return new Promise((resolve, reject) => {
        randomFill(new Uint8Array(length), (err, iv) => {
            if (err) reject(err);

            resolve(iv);
        });
    });
}


 async function getEncryptedData(algorithm, key, iv, plaintext) {
    let encrypted = Buffer.from([]);

    const cipher = createCipheriv(algorithm, key, iv);

    cipher.on("data", (data) => encrypted = Buffer.concat([encrypted, data]));

    cipher.on("end", () => {});
    
    cipher.write(plaintext);
    cipher.end();

    return encrypted;
 }


async function getDecryptedData(algorithm, key, iv, ciphertext) {
    const decipher = createDecipheriv(algorithm, key, iv);

    let decrypted = Buffer.from([]);
    decipher.on('readable', () => {
        let chunk;
        while (null !== (chunk = decipher.read())) {
            decrypted = Buffer.concat([decrypted, chunk]);
        }
    });
    decipher.on('end', () => {
    });

    const encrypted = ciphertext;
    decipher.write(encrypted);
    decipher.end();

    return decrypted;
}


 async function createScrypt(password, salt) {
    return new Promise((resolve, reject) => {
        scrypt(password, salt, 24, (err, key) => {
        if (err) reject(err);
        resolve(key);
    })
});
}


export default class {
    constructor() {
        this.algorithm = 'aes-192-cbc';
    }

    salt;
    algorithm;

    async encrypt(password, plaintext) {
        const salt = await genRandomKey(16);
        const iv = await genRandomKey(16);
        const key = await createScrypt(password, salt);

        const encrypted = await getEncryptedData(this.algorithm, key, iv, plaintext);
        
        return Buffer.from([...iv, ...salt, ...encrypted]);
    }

    async decrypt(password, cipherdata) {
        const iv = cipherdata.slice(0, 16);
        const salt = cipherdata.slice(16, 32);
        const ciphertext = cipherdata.slice(32);

        const key = await createScrypt(password, salt);

        return await getDecryptedData(this.algorithm, key, iv, ciphertext);
    }
}

export {
    genRandomBytes,
    hash
}