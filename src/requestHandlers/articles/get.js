import findArticles from "../../database/methods/articles/get.js";


async function getArticle(query, requesterLogin, limit, dbCall=findArticles) {
    const [articles, requesterVote] = await dbCall(query, requesterLogin, limit ? limit : null);
    if (!articles) return null;
    if (articles.length === 1) {
        let article = articles[0].toObject();
        article.requesterVote = requesterVote;
        return article;
    }
    else {
        return articles
    }
}

export default getArticle