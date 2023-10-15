import CipherThing, {genRandomBytes, hash} from "./cryptothings/CipherThing.js";
import  {createSession} from './auths.js';

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
    mongoAPI.connect('userdata');
    let data = req.body;
    let encryptedData = {}

    const salt = await genRandomBytes(16);
    const passwordHash = await hash(data.password, 200000, salt);
    const loginHash = await hash(data.login, 50000, 'static');
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
    }
    catch (err) {
        return res.status(400).json({messageTitle: "Failure", message: err.message});
    }
    return res.status(200).json({messageTitle: "Success", message: "New user succesfully registered"});
}


async function handleLogin(req, res, mongoAPI) {
    mongoAPI.connect('userdata');
    let data = req.body;
    let userInstance;

    const idHash = await hash(data.login, 50000, 'static');

    try {
        userInstance = await mongoAPI.readUser(idHash);
    }
    catch (err) {
        return res.status(400).json({messageTitle: "Failure", message: err.message});
    }

    if (userInstance) {
        try {
            console.log(userInstance)
            const salt = userInstance.salt;

            const passwordHash = await hash(data.password, 200000, salt);
            console.log(Buffer.from(userInstance.encryptedKey))
            const encryptedKey = Buffer.from(userInstance.encryptedKey);

            const encryptionKey = await cipher.decrypt(passwordHash, encryptedKey);
            const login = (await cipher.decrypt(encryptionKey, userInstance.login)).toString();

            if (login === data.login) {
                return res.status(200).json({messageTitle: "Success", message: "User logged in succesfully", token: await createSession({permissions: {'no': true}, identity: login})});
            }
        }
        catch (err) {
            return res.status(500).json({messageTitle: "Failure", message: err.message});
        }
    }
}


export {
    handleRegistration,
    handleLogin
}