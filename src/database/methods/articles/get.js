import Article from "../../models/article.js";


async function findArticles(searchQuery, limit) {
    let entries;
    if (limit) {
        entries = await Article.find(searchQuery).limit(limit);
    }
    else {
        entries = await Article.find(searchQuery);
    }
    if (entries.length > 0) {
        return entries;
    }
    else {
        return null;
    }
}


export default findArticles;