import { verifyToken } from "../../auth/jwt_gen.js";
import createArticle from "../../database/methods/articles/create.js";


async function handle(req, res) {
    const accessToken = req.headers['x-access-token'];
    const rawArticle = req.body;
    let article = rawArticle;
    
    try {
        if (!accessToken) {
            res.status(403).json({messageTitle: "Failure", message: "You need to be authorized to perfrom this action"});
            return;
        }
        const authToken = await verifyToken(accessToken);
        article.authorLogin = authToken.data.login;
    }
    catch (error) {
        if (error.message == "jwt expired") {
            res.status(403).json({messageTitle: "Failure", message: "You need to be authorized to perfrom this action"});
            return;
        }
    }

    if (!(rawArticle.body && rawArticle.tags && rawArticle.description)) {
        res.status(400).json({messageTitle: "Failure", message: "Not all fields provided"});
            return;
    }

    if (rawArticle.body.includes('<script>')) {
        res.status(400).json({messageTitle: "Failure", message: "Found blacklisted tags"});
        return;
    }
    if (typeof(article.tags) == "string") article.tags = rawArticle.tags.split(', ');

    article.postTime = new Date();
    try {
        await createArticle(article)
    }
    catch (err) {
        res.status(200).json({messageTitle: "FAILURE!", message: err.message})
        return
    }
    res.status(200).json({messageTitle: "Glorious success!", message: "Post was created successfully!"})
}


export default handle
