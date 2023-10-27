import getArticlesPreviews from "../../database/methods/articles/getArticlesPreviews.js";


async function getArticlesPreviews(req, res) {
    const articles = await getArticlesPreviews(req.query)

    if (articles) {
        res.status(200).json(articles);
        for (let i = 0; i < articles.length; i++) {
            articles[i].body = "";
        }
    }
    else {
        res.status(404).json({messageTitle: "FAILURE", message: "No articles was found"})
    }
}

export default getArticlesPreviews