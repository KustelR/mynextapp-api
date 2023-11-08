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
        const length = entries.length;
        for (let i = 0; i < length; i++) {
            entries[i]["upvotedBy"] = undefined;
            entries[i]["downvotedBy"] = undefined;
        }
        return entries;
    }
    else {
        return null;
    }
}


export default findArticles;