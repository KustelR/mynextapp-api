import mongoose, {Schema} from 'mongoose';


const articleSchema = new Schema({
    authorName: String,
    title: String,
    postTime: String,
    posterNickanme: String,
    upvotes: String,
    downvotes: String,
    body: String,
    tags: String
})

export default mongoose.model('Articles', articleSchema);