import jwt from 'jsonwebtoken';
import getPrivateKey from './getPrivateKey.js';


async function createToken(payload, options = { algorithm: 'RS256', expiresIn: "2h" }) {
    const privateKey = await getPrivateKey();
    
    return jwt.sign(privateKey, payload, options);
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