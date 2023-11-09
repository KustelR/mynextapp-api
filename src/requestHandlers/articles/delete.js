import deleteArticle from "../../database/methods/articles/delete.js";
import findArticles from "../../database/methods/articles/get.js";
import { AccessDeniedError } from "#src/errors/index.ts";

export default async function handle(query, userdata) {
    const articles = await findArticles(query);

    if (!articles) {
        res.status(404);
        res.send();
        return;
    }
    const article = articles[0];
    if (
        !(userdata.login === article.authorLogin) &&
        !userdata.articleDeletion &&
        !userdata.admin
    ) {
        throw new AccessDeniedError();
    }
    await deleteArticle(query);
}
