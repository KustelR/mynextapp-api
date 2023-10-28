import mongoose, {Schema} from 'mongoose';


const articleSchema = new Schema({
    title: String,
    postTime: Date,
    authorLogin: String,
    upvotes: {type: Number, default: 0},
    downvotes: {type: Number, default: 0},
    upvotedBy: {type: Array, default: []},
    downvotedBy: {type: Array, default: []},
    body: String,
    tags: Array,
    description: String,
})

export default mongoose.model('Articles', articleSchema);