async function getArticlesPreviews(req, res, mongoAPI) {
    const articles = await mongoAPI.getArticlesPreviews(req.query)

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