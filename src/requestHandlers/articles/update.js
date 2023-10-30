import updateArticle from "../../database/methods/articles/update.js";


/**
 * Handles PATCH requests to articles
 * @param {*} req Express request object from handler
 * @param {*} res Express response object from handler
 * @param {function} dbCall Function that will perform DB manipulation (For tests)
 * @returns 
 */
export default async function handle(req, res, dbCall=updateArticle) {
    let result;
    const query = req.query;
    const headers = req.headers;
    const patchData = req.body;
    try {
        result = await dbCall(query, patchData);
    }
    catch (error) {
        res.status(500).json(error);
        res.send();
        return result;
    }

    if (headers['accept']) {
        const requestedContentType = headers['accept'].split(';');

        if (requestedContentType[0] === 'application/json' && requestedContentType[1] === 'article') {
            res.status(200).json(result);
            res.send();
            return result;
        }
    }

    res.status(201);
    res.send();
    return result;
}