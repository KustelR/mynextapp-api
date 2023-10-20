import express from 'express';
import cors from 'cors';
import MongoAPI from './database/mongoAPI.js';
import handleRegistration from './requestHandlers/registration.js'
import handleFindUser from './requestHandlers/findUserPublic.js'
import handleTokenRefresh from './requestHandlers/genNewAccessToken.js'
import handleArticleCreation from './requestHandlers/postArticle.js';
import handleLogin from './requestHandlers/login.js';
import getArticle from './requestHandlers/getArticle.js';
import getArticlesPreviews from './requestHandlers/getArticlesPreviews.js';


const mongoAPI = new MongoAPI(process.env.MONGODB_URI);

const app = express();

app.use(cors());
app.use(express.json())


app.get("/api/v1/users/me", (req, res) => {
    handleFindUser(req, res, mongoAPI);
});


app.post("/api/v1/articles/create", (req, res) => {
    handleArticleCreation(req, res, mongoAPI);
});

app.get("/api/v1/articles/get", (req, res) => {
    getArticle(req, res, mongoAPI);
});

app.get("/api/v1/articles/get/previews", (req, res) => {
    getArticlesPreviews(req, res, mongoAPI);
});


app.get("/auth/v1/get_access_token", (req, res) => {
    handleTokenRefresh(req, res, mongoAPI);
});


app.post("/auth/v1/login", (req, res) => {
    handleLogin(req, res, mongoAPI);
});


app.post("/auth/v1/register", (req, res) => {
    handleRegistration(req, res, mongoAPI);
});


app.listen(5000, () => {
    console.log('listening on http://localhost:5000');
})

