import {verifyToken} from '../../../auth/jwt_gen.js';


async function getUserPublic(login, mongoAPI) {
    return await mongoAPI.readUserPublic(login);
}


async function userPublicByAccessKey(req, res, mongoAPI) {
    const accessToken = req.headers["x-access-token"];
    let token;
    if (accessToken) {
        try {
            token = await verifyToken(accessToken);
        }
        catch (err) {
            return res.status(400).json({messageTitle: "Failure", message: err.message})
        }

        const login = token.data.login;
        let userInstance;

        try {
            userInstance = await getUserPublic(login, mongoAPI);
        }
        catch (err) {
            return res.status(400).json({messageTitle: "Failure", message: err.message});
        }

        if (userInstance) {
            return res.status(200).json(userInstance)
        }
    }
    else {
        return res.status(400).json({messageTitle: "Failure"});
    }
}

export default userPublicByAccessKey
