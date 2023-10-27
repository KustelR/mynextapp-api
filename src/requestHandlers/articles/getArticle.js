import findArticles from "../../database/methods/articles/findArticles.js";


async function getArticle(req, res) {
    const article = await findArticles(req.query)

    if (article) {
        return res.status(200).json(article[0]);
    }
    else {
        return res.status(404).json({messageTitle: "FAILURE", message: "No such articles was found"})
    }
}

export default getArticle