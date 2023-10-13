import express from 'express';
import cors from 'cors';
import MongoAPI from './mongoAPI.js';
import {handleRegistration, handleLogin} from './reqHandlers.js'


const mongoAPI = new MongoAPI(process.env.MONGODB_CONNECTION_STRING);


const app = express();

app.use(cors());
app.use(express.json())


app.get("/api/v1/users", (req, res) => {
    const users = [
        {id: 1, name: "Oleg"},
        {id: 2, name: "aboba"},
        {id: 3, name: "AGDchan"},
    ];

    return res.status(200).json({users});
});

app.post("/api/v1/login", (req, res) => {
    handleLogin(req, res, mongoAPI);
});


app.post("/api/v1/register", (req, res) => {
    handleRegistration(req, res, mongoAPI);
});


app.listen(5000, () => {
    console.log('listening on http://localhost:5000');
})

