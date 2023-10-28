import deleteArticle from "../../database/methods/articles/deleteArticle.js";
import findArticles from "../../database/methods/articles/findArticles.js";
import { verifyToken } from "../../auth/jwt_gen.js";


export default async function handle(req, res) {
    let authToken;
    try {
        authToken = await verifyToken(req.headers["x-access-token"]);
    }
    catch (err) {
        res.status(403).json({messageTitle: "Failure", message: "You must be logged in to perform this action"});
        res.send();
        return;
    }

    const query = req.query;

    const articles = await findArticles(query);

    if (!articles) {
        res.status(404);
        res.send();
        return;
    }
    const article = articles[0]

    if (!(authToken.data.login === article.authorLogin) || authToken.data.permissions.articleDeletion) {
        res.status(403).json({messageTitle: "Failure", message: "You are restricted from deleting this article"});
        res.send();
        return;
    }

    try {
        await deleteArticle(query);
        res.status(201);
    }
    catch (error) {
        res.status(500).json({messageTitle: "Failure", message: error.message});
    }
    res.send()
}
