import express from 'express';
import cors from 'cors';
import MongoAPI from './database/mongoAPI.js';
import {handleRegistration, handleLogin} from './reqHandlers.js'
import handleFindUser from './requestHandlers/findUserPublic.js'


const mongoAPI = new MongoAPI(process.env.MONGODB_CONNECTION_STRING);


const app = express();

app.use(cors());
app.use(express.json())


app.get("/api/v1/users/me", (req, res) => {
    handleFindUser(req, res, mongoAPI);
    return res.status(500)
    
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

