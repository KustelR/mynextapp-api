import findArticles from "../../database/methods/articles/get.js";
import authUser from "./utils/authUser.js";

/**
 * Handles get request to articles
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getArticle(req, res) {
    const articles = await findArticles(req.query);

    const token = req.headers["x-access-token"];
    let authData = (await authUser(token, ["login"]));
    let requesterLogin;
    if (authData) {
        requesterLogin = authData.login;
    }

    if (articles) {
        let article = articles[0].toObject();

        if (article.upvotedBy.includes(requesterLogin)) {
            article.requesterVote = 1;
        }
        else if (article.downvotedBy.includes(requesterLogin)) {
            article.requesterVote = -1;
        }
        else {
            article.requesterVote = 0;
        }

        delete article["upvotedBy"];
        delete article["downvotedBy"];

        return res.status(200).json(article);
    }
    else {
        return res.status(404).json({messageTitle: "FAILURE", message: "No such articles was found"})
    }
}

export default getArticle