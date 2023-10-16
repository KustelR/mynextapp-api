import {verifyToken} from '../auth/jwt_gen.js';


async function getUserPublic(login, mongoAPI) {
    mongoAPI.connect('userdata');

    return await mongoAPI.readUserPublic(login);
}


async function userPublicByAccessKey(req, res, mongoAPI) {
    const accessToken = req.query.access_token;
    console.log(req.query);
    if (accessToken) {
        const token = await verifyToken(accessToken);

        const login = token.data.login;
        let userInstance;

        try {
            userInstance = await getUserPublic(login, mongoAPI);
        }
        catch (err) {
            return res.status(400).json({messageTitle: "Failure", message: err.message});
        }

        if (userInstance) {
            return res.status(200).json({user: userInstance})
        }
    }
    else {
        return res.status(400).json({messageTitle: "Failure"});
    }
}

export default userPublicByAccessKey