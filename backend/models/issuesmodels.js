import mongoose from "mongoose";

const { Schema } = mongoose;

const IssuesSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ['open', 'in progress', 'closed'],
        default: 'open',
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    repository:{
        type: Schema.Types.ObjectId,
        ref: 'Repository',
        required: true,
    }
});

const Issue = mongoose.model('Issue', IssuesSchema);

export default Issue;