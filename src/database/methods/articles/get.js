import Article from "../../models/article.js";


async function findArticles(searchQuery, requesterLogin, isPrivateRequest=false, limit=null) {
    let entries;
    let requesterVote;
    if (limit) {
        entries = await Article.find(searchQuery).limit(limit);
    }
    else {
        entries = await Article.find(searchQuery);
    }
    if (entries.length === 1 && requesterLogin) {
        const article = entries[0].toObject();

        if (article.upvotedBy.includes(requesterLogin)) {
            requesterVote = 1;
        }
        else if (article.downvotedBy.includes(requesterLogin)) {
            requesterVote = -1;
        }
        else {
            requesterVote = 0;
        }
    }
   if (entries.length > 0) {
        const length = entries.length;
        if (!isPrivateRequest) {
            for (let i = 0; i < length; i++) {
                entries[i]["upvotedBy"] = undefined;
                entries[i]["downvotedBy"] = undefined;
            }
        }

        return [entries, requesterVote];
    }
    else {
        return null;
    }
}


export default findArticles;