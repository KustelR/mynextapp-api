import mongoose, {Schema} from 'mongoose';


import 'dotenv/config';


const userSchema = new Schema({
    idhash: Buffer,
    encryptedKey: Buffer,
    salt: Buffer,
    login: Buffer,
    email: Buffer,
    password: Buffer,
    nickname: Buffer,
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
        console.log(user);
        const entries = await User.find({idhash: user.idhash});
        if (entries.length == 0) {
            await user.save();
        }
        else {
            throw new Error("User with this login already exists");
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