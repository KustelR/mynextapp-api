import mongoose, {Schema} from 'mongoose';
import crypto from 'crypto';


import 'dotenv/config';


const userSchema = new Schema({
    login: String,
    email: String,
    password: String,
    nickname: String,
    articles: Array
})

const User = mongoose.model('Users', userSchema);


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
        const entries = await User.find({login: user.login});
        if (entries.length == 0) {
            await user.save();
        }
        else {
            throw new Error("User with this login already exists");
        }
    }

    async loginUser(userdata) {
        const entries = await User.find({login: userdata.login});
        if (entries.length == 0) {
            throw new Error("User with this login and password does not exists");
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