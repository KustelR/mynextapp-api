async function getArticle(req, res, mongoAPI) {
    mongoAPI.connect('myreactapp');

    const article = await mongoAPI.findArticle(req.query.title)

    if (article) {
        res.status(200).json(article);
    }
    else {
        res.status(404).json({messageTitle: "FAILURE", message: "No such articles was found"})
    }
}

export default getArticle