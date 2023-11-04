import {verifyToken} from '../../auth/jwt_gen.js';
import {createAccessToken} from '../../auth/token_gen.js';


async function getUserPublic(login, mongoAPI) {

    return await mongoAPI.readUserPublic(login);
}


async function userPublicByAccessKey(req, res) {
    const refreshToken = req.query.refresh_token;
    let token;
    if (refreshToken) {
        try {
            token = await verifyToken(refreshToken);
            const newToken = await createAccessToken(token.login, token)
            //console.log("new token", newToken);
            return res.status(200).json(newToken)
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
