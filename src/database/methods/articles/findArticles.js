import Article from "../../models/article.js";


async function findArticles(searchQuery) {
    const entries = await Article.find(searchQuery);
    if (entries.length > 0) {
        return entries;
    }
    else {
        return null;
    }
}


export default findArticles;