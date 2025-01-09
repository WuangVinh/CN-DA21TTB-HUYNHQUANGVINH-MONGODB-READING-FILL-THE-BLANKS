const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizType: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Result', ResultSchema);
