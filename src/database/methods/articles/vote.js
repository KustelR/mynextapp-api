import findArticles from "./get.js";


/**
 * Handles post "likes" by authorized users
 * @param {object} query Selection query for mongodb
 * @param {object} changeData Object with ```login``` and ```voteChange``` count (+1 or -1) as fields
 * 
 * @returns {Promise<boolean>}
 */
async function updateArticle(query, changeData) {
    const [article] = (await findArticles(query, null, true, 1))[0];
    console.log(article);
    if (!article) throw new Error("No articles found");

    if (changeData.voteChange === 1) {
        if (article.downvotedBy.includes(changeData.login)) {
            const downvotedBy = article.downvotedBy;
            const alsoIndex = downvotedBy.indexOf(changeData.login)
            downvotedBy.splice(alsoIndex, 1);
            article.downvotedBy = downvotedBy;
            article.votes += 1;
        }
        if (article.upvotedBy.includes(changeData.login)) {
            const upvotedBy = article.upvotedBy;
            const index = upvotedBy.indexOf(changeData.login)
            upvotedBy.splice(index, 1);
            article.upvotedBy = upvotedBy;
            article.votes += -1;
        }
        else {
            const upvotedBy = article.upvotedBy;
            upvotedBy.push(changeData.login);
            article.upvotedBy = upvotedBy;
            article.votes += 1;
        }
    }
    else {
        if (article.upvotedBy.includes(changeData.login)) {
            const upvotedBy = article.upvotedBy;
            const alsoIndex = upvotedBy.indexOf(changeData.login)
            upvotedBy.splice(alsoIndex, 1);
            article.upvotedBy = upvotedBy;
            article.votes -= 1;
        }
        if (article.downvotedBy.includes(changeData.login)) {
            const downvotedBy = article.downvotedBy;
            const index = downvotedBy.indexOf(changeData.login)
            downvotedBy.splice(index, 1);
            article.downvotedBy = downvotedBy;
            article.votes += 1;
        }
        else {
            const downvotedBy = article.downvotedBy;
            downvotedBy.push(changeData.login);
            article.downvotedBy = downvotedBy;
            article.votes += -1;
        }
    }
    return await article.save();
}


export default updateArticle