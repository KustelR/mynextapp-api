import { verifyToken } from "../auth/jwt_gen.js";


async function handle(req, res, mongoAPI) {
    const rawArticle = req.body;
    let article = rawArticle;
    console.log(rawArticle)
    if (!rawArticle.accessToken) {
        res.status(403).json({messageTitle: "Failure", message: "You need to be authorized to perfrom this action"});
        return;
    }
    try {
        const authToken = await verifyToken(rawArticle.accessToken);
        article.authorLogin = authToken.data.login;
    }
    catch (error) {
        if (error.message == "jwt expired") {
            res.status(403).json({messageTitle: "Failure", message: "You need to be authorized to perfrom this action"});
            return;
        }
    }
    article.tags = rawArticle.tags.split(', ');
    article.postTime = new Date();
    mongoAPI.connect('myreactapp');
    try {
        await mongoAPI.createArticle(article)
    }
    catch (err) {
        res.status(200).json({messageTitle: "FAILURE!", message: err.message})
        return
    }
    res.status(200).json({messageTitle: "Glorious success!", message: "Post was created successfully!"})
}


export default handle
