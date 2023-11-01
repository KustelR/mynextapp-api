import getArticlesPreviews from "../../database/methods/articles/getPreviews.js";


async function ArticlePreviews(query) {
    const articles = await getArticlesPreviews(query);
    return articles;
}

export default ArticlePreviews