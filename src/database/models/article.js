import mongoose, {Schema} from 'mongoose';


const articleSchema = new Schema({
    title: String,
    postTime: Number,
    authorLogin: String,
    upvotes: String,
    downvotes: String,
    body: String,
    tags: Array,
    description: String,
})

export default mongoose.model('Articles', articleSchema);