import Article from "../../models/article.js";


async function deleteArticle(query) {
    return await Article.deleteOne(query);
}


export default deleteArticle