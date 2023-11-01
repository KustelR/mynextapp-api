import deleteArticle from "../../database/methods/articles/delete.js";
import findArticles from "../../database/methods/articles/get.js";


class AccessDeniedError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Error);
        }

        this.name = "AccessDeniedError"
    }
}


export default async function handle(query, userdata) {

    const articles = await findArticles(query);

    if (!articles) {
        res.status(404);
        res.send();
        return;
    }
    const article = articles[0]

    if (!(userdata.login === article.authorLogin) || userdata.articleDeletion) {
        throw new AccessDeniedError;
    }
    await deleteArticle(query);
}
