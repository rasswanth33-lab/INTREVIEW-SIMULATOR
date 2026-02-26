const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please add a target company (e.g. TCS, Amazon, General)'],
        trim: true,
    },
    role: {
        type: String,
        required: [true, 'Please add a target role (e.g. Frontend, Backend)'],
        trim: true,
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: [true, 'Please specify difficulty'],
    },
    type: {
        type: String,
        enum: ['Technical', 'HR', 'Aptitude'],
        required: [true, 'Please specify question type'],
    },
    text: {
        type: String,
        required: [true, 'Please add the question text'],
    },
    sampleAnswer: {
        type: String,
        required: [true, 'Please provide a sample answer for evaluation reference'],
    },
    evaluationKeywords: {
        type: [String],
        required: [true, 'Please provide keywords expected in a good answer'],
    },
    options: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes to speed up randomized questions query
questionSchema.index({ company: 1, role: 1, difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
