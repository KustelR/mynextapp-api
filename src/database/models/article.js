import mongoose, {Schema} from 'mongoose';


const articleSchema = new Schema({
    title: String,
    postTime: Date,
    authorLogin: String,
    votes: {type: Number, default: 0},
    upvotedBy: [String],
    downvotedBy: [String],
    body: String,
    tags: Array,
    description: String,
})

export default mongoose.model('Articles', articleSchema);