import Article from "../../models/article.js";
import findArticles from "./get.js";


/**
 * 
 * @param {object} query Selection query for mongodb
 * @param {object} changes New data to be patched into document
 * 
 * @returns {Promise<boolean>}
 */
async function updateArticle(query, changes) {
    const articles = await findArticles(query);

    if (!articles) throw new Error("No articles found");

    if (articles.length > 1) {
        throw new Error('Specified query returns more than one article. Can not update')
    }

    const article = articles[0];

    Object.assign(article, changes);

    return await article.save();
}


export default updateArticle