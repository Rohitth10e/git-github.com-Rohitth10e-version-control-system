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

const Issues = mongoose.model('Issues', IssuesSchema);
module.exports = Issues;