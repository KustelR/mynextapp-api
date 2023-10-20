import mongoose, {Schema} from 'mongoose';


const userSchema = new Schema({
    login: String,
    email: String,
    nickname: String,
    articles: Array
})

export default mongoose.model('PublicUsers', userSchema);