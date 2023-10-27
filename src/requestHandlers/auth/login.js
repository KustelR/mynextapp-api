import {hash} from "../../cryptothings/CipherThing.js";
import {createRefreshToken, createAccessToken} from '../../auth/token_gen.js';

/**
 * Verifies user and sends access and refresh tokens
 * @param {*} req 
 * @param {*} res 
 * @param {MongoAPI} mongoAPI 
 * @param {CipherThing} cipher 
 * @returns Express response? I don't really know how this thing works
 */
export default async function handleLogin(req, res, mongoAPI, cipher) {
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
                const tokenData = {permissions: {}, login: login};
                return res.status(200).json(
                {
                    messageTitle: "Success",
                    message: "User logged in succesfully",
                    toLocalStorage: {
                        refreshToken: await createRefreshToken(idHash, tokenData),
                        accessToken: await createAccessToken(idHash, tokenData)
                    }
                });
            }
        }
        catch (err) {
            return res.status(500).json({messageTitle: "Failure", message: err.message});
        }
    }
}