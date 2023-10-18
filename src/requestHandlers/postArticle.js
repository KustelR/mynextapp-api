async function handle(req, res, mongoAPI) {
    const article = req.body;
    mongoAPI.connect('myreactapp');
    try {
        await mongoAPI.createArticle(article)
    }
    catch (err) {
        res.status(200).json({messageTitle: "FAILURE!", message: err.message})
        return
    }
    res.status(200).json({messageTitle: "Glorious success!", message: "Post was mischefiously created!"})
}

export default handle
