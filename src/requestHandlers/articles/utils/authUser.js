import { verifyToken } from "../../../auth/jwt_gen.js";


/**
 * Checks auth token and returns values of requested fields
 * @param {object} token JWT token
 * @param {[string]} validate Array of permission names to validate
 * @returns {object} Map of permissions and userdata requested in ```validate```
 */
export default async function auth(token, validate) {
    let authToken;

    try {
        authToken = await verifyToken(token);
    }
    catch (err) {
        return null;
    }

    let result = {};
    for (let i = 0; i < validate.length; i++) {
        result[validate[i]] = authToken.data[validate[i]];
    }
    return result;
}
