import {createToken, verifyToken} from './jwt_gen.js';


async function createAccessToken(user_id, accessRights) {
    return await createToken({user_id: user_id, accessRights: accessRights}, {algorithm: 'RS256', expiresIn: "6h"})
}

async function createRefreshToken(user_id, accessRights) {
    return await createToken({
        user_id: user_id, 
        accessRights: accessRights
        },
        {algorithm: 'RS256',
         expiresIn: "30d"})
}

async function verifyAccess(accessToken, requestedAccess) {
    const token = await verifyToken(accessToken);

    return (token.accessRights[requestedAccess]);
}

export {
    createAccessToken,
    createRefreshToken,
    verifyAccess,
}