async function handleRegistration(req, res, mongoAPI) {
    mongoAPI.connect('userdata');
    let data = req.body;

    try {
        await mongoAPI.createUser(data);
    }
    catch (err) {
        return res.status(400).json({messageTitle: "Failure", message: err.message});
    }
    return res.status(200).json({messageTitle: "Success", message: "New user succesfully registered"});
}


async function handleLogin(req, res, mongoAPI) {
    mongoAPI.connect('userdata');
    let data = req.body;
    let token;

    try {
        token = await mongoAPI.loginUser(data);
    }
    catch (err) {
        return res.status(400).json({messageTitle: "Failure", message: err.message});
    }
    return res.status(200).json({messageTitle: "Success", message: "User logged in succesfully", token: token});
}


export {
    handleRegistration,
    handleLogin
}