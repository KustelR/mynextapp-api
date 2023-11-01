import vote from "../../database/methods/articles/vote.js";


/**
 * Changes votes in article
 * @param {*} query Selection query
 * @param {object} data Data to update
 * @param {function} dbCall Function that will perform DB manipulation (For tests)
 * @returns 
 */
export default async function handle(query, data, dbCall=vote) {

    let result;
    result = await dbCall(query, {login: data.login, voteChange: data.voteChange});
    delete result["upvotedBy"];
    delete result["downvotedBy"];
    return result;
}
