import mongoose, {Schema} from 'mongoose';


const articleSchema = new Schema({
    title: String,
    postTime: Number,
    authorLogin: String,
    upvotes: {type: Number, default: 0},
    downvotes: {type: Number, default: 0},
    body: String,
    tags: Array,
    description: String,
})

export default mongoose.model('Articles', articleSchema);