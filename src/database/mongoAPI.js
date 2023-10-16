import mongoose, {Schema} from 'mongoose';
import User from './models/user.js';
import UserPublic from './models/userPublic.js';


import 'dotenv/config';


class MongoAPI {
    constructor(connectionString) {
        this.connectionString = connectionString;
    }

    connectionString;
    isConnected = false;


    async connect(db) {
        if (!this.isConnected) {
            await mongoose.connect(this.connectionString + db);
            this.isConnected = true;
        }
    }

    async createUser(userdata) {
        const user = new User(userdata);
        const entries = await User.find({idhash: user.idhash});
        if (entries.length == 0) {
            await user.save();
        }
        else {
            throw new Error("User with this login already exists");
        }
    }

    async createUserPublic(userdata) {
        const user = new UserPublic(userdata);
        const entries = await UserPublic.find({login: user.login});
        if (entries.length == 0) {
            await user.save();
        }
        else {
            throw new Error("User with this login already exists");
        }
    }

    async readUserPublic(login) {
        const entries = await UserPublic.find({login: login});
        if (entries.length == 0) {
            throw new Error("user not found");
        }
        else {
            return entries[0];
        }
    }

    async readUser(idhash) {
        const entries = await User.find({idhash: idhash});
        if (entries.length == 0) {
            throw new Error("user not found");
        }
        else {
            return entries[0];
        }
    }

    async loginUser(userdata) {
        const entries = await User.find({login: userdata.login});
        if (entries.length == 0) {
            return null;
        }
        else if (entries[0].password !== userdata.password) {
            throw new Error("User with this login and password does not exists"); 
        }
        else {
            return crypto.randomBytes(256);
        }
    }
}

export default MongoAPI