import findArticles from "../../database/methods/articles/get.js";


async function getArticle(query, requesterLogin, dbCall=findArticles) {
    const articles = await dbCall(query);
    if (articles) {
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
    return null;
}

export default getArticle