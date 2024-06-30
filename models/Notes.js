const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
        },
        image: {
            type: String,
        },
        video: {
            type: String,
        },
        createdDate: {
            type: Date,
            default: Date.now(),
        },
        lastUpdatedDate: {
            type: Date,
            default: Date.now(),
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Assuming your user model is named 'User'
            required: true,
        },
    },
    {
        collection: 'Notes',
    }
);

module.exports = mongoose.model('Note', noteSchema);
