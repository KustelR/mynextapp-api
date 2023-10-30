import express from 'express';
import cors from 'cors';

import MongoAPI from './database/mongoAPI.js';
import CipherThing from './cryptothings/CipherThing.js';

import handleRegistration from './requestHandlers/auth/registration.js'
import handleFindUser from './requestHandlers/findUserPublic.js'
import handleTokenRefresh from './requestHandlers/auth/genNewAccessToken.js'
import handleLogin from './requestHandlers/auth/login.js';

import getArticlesPreviews from './requestHandlers/articles/getPreviews.js';
import getArticle from './requestHandlers/articles/get.js';
import createArticle from './requestHandlers/articles/create.js'
import updateArticle from './requestHandlers/articles/update.js';
import voteForArticle from './requestHandlers/articles/vote.js';
import deleteArticle from './requestHandlers/articles/delete.js';


const mongoAPI = new MongoAPI(process.env.MONGODB_URI);
mongoAPI.connect('myreactapp');

const cipher = new CipherThing();


const app = express();

app.use(cors());
app.use(express.json())

app.use((req, res, next) => {
    delete req.query["any"];
    console.log(req.query)
    const isAuth = req.headers["x-access-token"];
    console.log(`Received ${isAuth ? 'authorized' : 'unauthorized'} request from ${req.headers.origin} to ${req.path} at ${Date()}`);
    next();
})


app.get("/api/v1/users/me", (req, res) => {
    handleFindUser(req, res, mongoAPI);
});

app.post("/api/v1/articles", (req, res) => {
    createArticle(req, res);
});

app.get("/api/v1/articles", (req, res) => {
    getArticle(req, res);
});

app.patch("/api/v1/articles", (req, res) => {
    updateArticle(req, res);
});

app.put("/api/v1/articles/vote", (req, res) => {
    voteForArticle(req, res);
});

app.delete("/api/v1/articles", (req, res) => {
    deleteArticle(req, res);
});

app.get("/api/v1/articles/previews", (req, res) => {
    getArticlesPreviews(req, res, mongoAPI);
});


app.get("/auth/v1/accesstoken", (req, res) => {
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

