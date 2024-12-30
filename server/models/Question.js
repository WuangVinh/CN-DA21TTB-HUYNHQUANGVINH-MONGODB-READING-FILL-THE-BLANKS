const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question_id: {
        type: Number,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    question_text: {
        type: String,
        required: true
    },
    blanks: [{
        id: Number,
        options: [String],
        correctAnswer: String
    }],
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    explanation: String,
    points: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Question', questionSchema);
