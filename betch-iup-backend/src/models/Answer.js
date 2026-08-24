const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.ObjectId,
        ref: 'InterviewSession',
        required: true,
    },
    question: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    answerText: {
        type: String,
        required: [true, 'Answer text cannot be empty'],
    },
    score: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },
    feedback: {
        strength: String,
        weakness: String,
        improvementSuggestion: String,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

// Calculate average session score when an answer is saved
answerSchema.statics.calculateSessionScore = async function (sessionId) {
    const obj = await this.aggregate([
        {
            $match: { session: sessionId }
        },
        {
            $group: {
                _id: '$session',
                averageScore: { $avg: '$score' }, // score out of 10
                totalAnswers: { $sum: 1 }
            }
        }
    ]);

    try {
        if (obj[0]) {
            // Scale from 10 to 100 and save
            const scaledScore = Math.round(obj[0].averageScore * 10);
            await mongoose.model('InterviewSession').findByIdAndUpdate(sessionId, {
                totalScore: scaledScore
            });
        }
    } catch (err) {
        console.error(err);
    }
};

// Call calculateSessionScore after save
answerSchema.post('save', function () {
    this.constructor.calculateSessionScore(this.session);
});

module.exports = mongoose.model('Answer', answerSchema);
