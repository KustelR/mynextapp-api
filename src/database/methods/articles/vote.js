import findArticles from "./get.js";


/**
 * 
 * @param {object} query Selection query for mongodb
 * @param {object} changeData Object with ```login``` and ```voteChange``` count (+1 or -1) as fields
 * 
 * @returns {Promise<boolean>}
 */
async function updateArticle(query, changeData) {
    const articles = await findArticles(query);

    if (!articles) throw new Error("No articles found");

    if (articles.length > 1) {
        throw new Error('Specified query returns more than one article. Can not update')
    }

    const article = articles[0];
    if (changeData.voteChange === 1) {
        const upvotedBy = article.upvotedBy;
        upvotedBy.push(changeData.login);
        article.upvotedBy = upvotedBy;
    }
    else {
        const downvotedBy = article.downvotedBy;
        downvotedBy.push(changeData.login);
        article.downvotedBy = downvotedBy;
    }
    article.votes += changeData.voteChange;
    return await article.save();
}


export default updateArticle