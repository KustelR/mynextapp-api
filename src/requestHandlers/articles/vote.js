import vote from "../../database/methods/articles/vote.js";
import { verifyToken } from "../../auth/jwt_gen.js";
import authUser from "./utils/authUser.js";


/**
 * Changes votes in article
 * @param {*} req Express request object from handler
 * @param {*} res Express response object from handler
 * @param {function} dbCall Function that will perform DB manipulation (For tests)
 * @returns 
 */
export default async function handle(req, res, dbCall=vote) {
    let authToken;
    try {
        authToken = await verifyToken(req.headers["x-access-token"]);
    }
    catch (err) {
        res.status(403).json({messageTitle: "Failure", message: "You must be logged in to perform this action"});
        res.send();
        return;
    }

    let result;
    const query = req.query;
    const data = req.body;
    try {
        result = await dbCall(query, {login: authToken.data.login, voteChange: data.voteChange});
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error.message);
        res.send();
        return result;
    }
    res.status(201);
    res.send();
    return result;
}