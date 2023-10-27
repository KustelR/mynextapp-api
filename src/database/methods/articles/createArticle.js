import Article from "../../models/article.js";


async function createArticle(articleData) {
    const article = new Article(articleData);
    article.save();
}


export default createArticle