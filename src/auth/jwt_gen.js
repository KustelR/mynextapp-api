import jwt from 'jsonwebtoken';
import fs from 'fs';


async function getPrivateKey() {
    return process.env.SERVER_KEY
    /*
    return new Promise(function(resolve, reject) {
        fs.readFile('./private.key', {encoding: 'utf-8'}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
    */
}


async function createToken(payload, options = { algorithm: 'RS256', expiresIn: "2h" }) {
    const privateKey = await getPrivateKey();

    return new Promise(function(resolve, reject) {

        jwt.sign(payload, privateKey, options, (err, token) => {
            if (err) reject(err);
            resolve(token);
          })
    })
}


async function verifyToken(token) {
    const privateKey = await getPrivateKey();

    return new Promise(function(resolve, reject) {
        jwt.verify(token, privateKey, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    })
}

export {
    createToken,
    verifyToken
}