import getArticlesPreviews from "../../database/methods/articles/getPreviews.js";


async function ArticlePreviews(query) {
    const articles = await getArticlesPreviews(query);
    let result = [];
    articles.forEach(function (article) {
        const objArticle = article.toObject();
        delete objArticle.body;
        delete objArticle.__v;
        delete objArticle.upvotedBy;
        delete objArticle.downvotedBy;
        result.push(objArticle);
    });
    return result;
}

export default ArticlePreviews