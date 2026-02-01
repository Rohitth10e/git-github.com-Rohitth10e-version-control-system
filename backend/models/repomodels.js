import mongoose from "mongoose";

const { Schema } = mongoose;

const repoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    content: [{
        type: String,
    }],
    visibility: {
        type: Boolean
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    issues: [{
        type: Schema.Types.ObjectId,
        ref: 'Issue',
    }]
});

const Repository = mongoose.model('Repository', repoSchema);

export default Repository;