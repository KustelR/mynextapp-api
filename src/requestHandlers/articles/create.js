import createArticle from "../../database/methods/articles/create.js";


async function handle(articleData, posterLogin, dbCall=createArticle) {
    let article = articleData;

    article.postTime = new Date();
    article.authorLogin = posterLogin;

    await dbCall(article)
}


export default handle
