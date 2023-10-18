import CipherThing, {genRandomBytes, hash} from "../cryptothings/CipherThing.js";
import {createRefreshToken, createAccessToken, verifyAccess} from '../auth/token_gen.js';

const cipher = new CipherThing('static');


async function decryptUserData(passwordHash, data) {
    let encryptionKey;
    try {
        encryptionKey = await cipher.decrypt(passwordHash, data.encryptedkey);
        delete data["encryptedkey"];
    }
    catch (error) {
        if (error.reason == 'bad decrypt') {
            throw new Error('invalid password');
        }
        throw error;
    }
    
    let decryptedData = {};

    const entriesEncrypted = Object.entries(data);
    for (let i = 0; i < entriesEncrypted.length; i++) {
        const key = entriesEncrypted[i][0];
        const value = entriesEncrypted[i][1];
        let decrypted;

        try {
            decrypted = (await cipher.decrypt(encryptionKey, Buffer.from(value)));
        }
        catch (e) {
            console.error(e);
        }
        
        decryptedData[key] = decrypted;
    }
    return decryptedData;
}


async function handleRegistration(req, res, mongoAPI) {
    mongoAPI.connect('myreactapp');
    let data = req.body;
    let encryptedData = {}

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
    return res.status(201).json(
        {
        messageTitle: "Success", 
        message: "New user succesfully registered",
        toLocalStorage: {
            refreshToken: await createRefreshToken(
                loginHash, 
                {
                    "basic-access": true, 
                    "personal_cabinet": true, 
                    login: data.login
                }),
            accessToken: await createAccessToken(
                loginHash, 
                {
                    "basic-access": true, 
                    "personal_cabinet": true, 
                    login: data.login
                })
        }
    })
}


export default handleRegistration
