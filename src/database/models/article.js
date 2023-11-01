import mongoose, {Schema} from 'mongoose';


const articleSchema = new Schema({
    title: {type: String, required: true},
    postTime: Date,
    authorLogin: {type: String, required: true},
    votes: {type: Number, default: 0},
    upvotedBy: [String],
    downvotedBy: [String],
    body: {type: String, required: true},
    tags: Array,
    description: {type: String, required: true},
})

export default mongoose.model('Articles', articleSchema);