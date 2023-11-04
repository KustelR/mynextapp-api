import {createRefreshToken, createAccessToken} from '../../auth/token_gen.js';
import { genRandomBytes, hash } from '../../cryptothings/CipherThing.js';


/**
 * Registeres new user
 * @param {*} req 
 * @param {*} res 
 * @param {MongoAPI} mongoAPI 
 * @param {CipherThing} cipher 
 * @returns Express response? I don't really know how this thing works
 */
async function handleRegistration(req, res, mongoAPI, cipher) {
    let data = req.body;
    let encryptedData = {};

    const salt = await genRandomBytes(16);
    const passwordHash = await hash(data.password, 200000, salt);
    const loginHash = await hash(data.login, 200000, 'static');
    delete data["password"];


    const encryptionKey = await genRandomBytes(32);
    const entries = Object.entries(data);

    for (let i = 0; i < entries.length; i++) {
        const key = entries[i][0];
        const value = entries[i][1];
        const encrypted = await cipher.encrypt(encryptionKey, value);
        encryptedData[key] = encrypted;
    }

    encryptedData["encryptedKey"] = (await cipher.encrypt(passwordHash, encryptionKey))
    encryptedData.idhash = loginHash;
    encryptedData.salt = salt;

    try {
        await mongoAPI.createUser(encryptedData);
        await mongoAPI.createUserPublic(data);
    }
    catch (err) {
        return res.status(400).json({messageTitle: "Failure", message: err.message});
    }

    const tokenData = {login: data.login};
    return res.status(200).json(
        {
        messageTitle: "Success", 
        message: "New user succesfully registered",
        toLocalStorage: {
            refreshToken: await createRefreshToken(loginHash, tokenData),
            accessToken: await createAccessToken(loginHash, tokenData)
        }
    })
}


export default handleRegistration
