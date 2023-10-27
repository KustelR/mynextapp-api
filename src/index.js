import express from 'express';
import cors from 'cors';

import MongoAPI from './database/mongoAPI.js';
import CipherThing from './cryptothings/CipherThing.js';

import handleRegistration from './requestHandlers/auth/registration.js'
import handleFindUser from './requestHandlers/findUserPublic.js'
import handleTokenRefresh from './requestHandlers/auth/genNewAccessToken.js'
import handleLogin from './requestHandlers/auth/login.js';

import getArticlesPreviews from './requestHandlers/articles/getArticlesPreviews.js';
import getArticle from './requestHandlers/articles/getArticle.js';
import createArticle from './requestHandlers/articles/createArticle.js'
import updateArticle from './requestHandlers/articles/updateArticle.js';
import deleteArticle from './requestHandlers/articles/deleteArticle.js';


const mongoAPI = new MongoAPI(process.env.MONGODB_URI);
mongoAPI.connect('myreactapp');

const cipher = new CipherThing();


const app = express();

app.use(cors());
app.use(express.json())


app.get("/api/v1/users/me", (req, res) => {
    handleFindUser(req, res);
});

app.post("/api/v1/articles", (req, res) => {
    createArticle(req, res);
});

app.get("/api/v1/articles", (req, res) => {
    getArticle(req, res);
});

app.put("/api/v1/articles", (req, res) => {
    updateArticle(req, res);
});

app.delete("/api/v1/articles", (req, res) => {
    deleteArticle(req, res);
});

app.get("/api/v1/articles/previews", (req, res) => {
    getArticlesPreviews(req, res, mongoAPI);
});


app.get("/auth/v1/get_access_token", (req, res) => {
    handleTokenRefresh(req, res, mongoAPI);
});

app.post("/auth/v1/login", (req, res) => {
    handleLogin(req, res, mongoAPI, cipher);
});

app.post("/auth/v1/register", (req, res) => {
    handleRegistration(req, res, mongoAPI, cipher);
});


app.listen(5000, () => {
    console.log('listening on http://localhost:5000');
})

