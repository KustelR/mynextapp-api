import CipherThing, {genRandomBytes, hash} from "../cryptothings/CipherThing.js";
import {createRefreshToken, createAccessToken, verifyAccess} from '../auth/token_gen.js';

const cipher = new CipherThing();


export default async function handleLogin(req, res, mongoAPI) {
    mongoAPI.connect('myreactapp');
    let data = req.body;
    let userInstance;

    const idHash = await hash(data.login, 200000, 'static');

    try {
        userInstance = await mongoAPI.readUser(idHash);
    }
    catch (err) {
        return res.status(400).json({messageTitle: "Failure", message: err.message});
    }

    if (userInstance) {
        try {
            const salt = userInstance.salt;

            const passwordHash = await hash(data.password, 200000, salt);
            const encryptedKey = Buffer.from(userInstance.encryptedKey);

            const encryptionKey = await cipher.decrypt(passwordHash, encryptedKey);
            const login = (await cipher.decrypt(encryptionKey, userInstance.login)).toString();

            if (login === data.login) {
                return res.status(200).json(
                {
                    messageTitle: "Success",
                    message: "User logged in succesfully",
                    toLocalStorage: {
                        refreshToken: await createRefreshToken(
                            idHash, 
                            {
                                "basic-access": true, 
                                "personal_cabinet": true, 
                                login: data.login
                            }),
                        accessToken: await createAccessToken(
                            idHash, 
                            {
                                "basic-access": true, 
                                "personal_cabinet": true, 
                                login: data.login
                            })
                    }
                });
            }
        }
        catch (err) {
            return res.status(500).json({messageTitle: "Failure", message: err.message});
        }
    }
}