const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium',
    },
    questions: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
    }],
    status: {
        type: String,
        enum: ['InProgress', 'Completed', 'Abandoned'],
        default: 'InProgress',
    },
    totalScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    completedAt: {
        type: Date,
    },
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
