import Article from "../../models/article.js";


async function deleteArticle(query) {
    Article.deleteOne(query)
}


export default deleteArticle