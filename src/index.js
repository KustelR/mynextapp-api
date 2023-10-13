import express from 'express';
import cors from 'cors';


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
    let data = req.body;
    console.log(data);

    return res.status(200).json({messageTitle: "Success", message: "Logged in successfully"});
});


app.post("/api/v1/register", (req, res) => {
    let data = req.body;
    console.log(data);

    return res.status(200).json({messageTitle: "Success", message: "New user succesfully registered"});
});


app.listen(5000, () => {
    console.log('listening on http://localhost:5000');
})