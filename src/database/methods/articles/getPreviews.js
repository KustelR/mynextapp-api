import Article from "../../models/article.js";


async function getArticlesPreviews(q) {
    const entries = await Article.find(q);
    if (entries.length > 0) {
        return entries;
    }
    else {
        return null;
    }
}


export default getArticlesPreviews