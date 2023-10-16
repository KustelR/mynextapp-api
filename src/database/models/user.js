import mongoose, {Schema} from 'mongoose';


const userSchema = new Schema({
    idhash: Buffer,
    encryptedKey: Buffer,
    salt: Buffer,
    login: Buffer,
    email: Buffer,
    password: Buffer,
    nickname: Buffer,
})

export default mongoose.model('Users', userSchema);