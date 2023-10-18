import {verifyToken} from '../auth/jwt_gen.js';
import {createAccessToken} from '../auth/token_gen.js';


async function getUserPublic(login, mongoAPI) {
    mongoAPI.connect('myreactapp');

    return await mongoAPI.readUserPublic(login);
}


async function userPublicByAccessKey(req, res, mongoAPI) {
    const refreshToken = req.query.refresh_token;
    let token;
    let login;
    if (refreshToken) {
        try {
            token = await verifyToken(refreshToken);
            login = token.data.login;
            return res.status(200).json({accessToken: await createAccessToken(login, token.data)})
        }
        catch (err) {
            return res.status(400).json({messageTitle: "Failure", message: err.message})
        }
    }
    else {
        return res.status(400).json({messageTitle: "Failure", message: "no refresh token"});
    }
}

export default userPublicByAccessKey
