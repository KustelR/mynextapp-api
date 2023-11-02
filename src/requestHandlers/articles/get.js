import findArticles from "../../database/methods/articles/get.js";


async function getArticle(query, requesterLogin, limit, dbCall=findArticles) {
    const articles = await dbCall(query, limit ? limit : null);
    if (articles.length === 1) {
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

        return article;
    }
    else {
        return articles
    }
    return null;
}

export default getArticle