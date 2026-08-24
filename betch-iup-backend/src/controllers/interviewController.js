const InterviewSession = require('../models/InterviewSession');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const aiEvaluationService = require('../services/aiEvaluationService');

// @desc    Start an interview session
// @route   POST /api/interviews/start
// @access  Private
const startInterview = async (req, res, next) => {
    try {
        const { company, role, difficulty } = req.body;

        if (!company || !role) {
            return res.status(400).json({ status: 'error', message: 'Company and role are required' });
        }

        // Build query — do NOT filter by difficulty so we always have enough questions
        const query = {
            company: new RegExp(company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
            role: new RegExp(role.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        };

        // Count available questions first, then sample up to that count (max 5)
        const totalAvailable = await Question.countDocuments(query);

        if (!totalAvailable) {
            return res.status(404).json({
                status: 'error',
                message: `No questions found for "${company} – ${role}". Please try a different company or role.`
            });
        }

        const sampleSize = Math.min(5, totalAvailable);

        // Fetch random questions
        const questions = await Question.aggregate([
            { $match: query },
            { $sample: { size: sampleSize } }
        ]);

        // Extract IDs
        const questionIds = questions.map(q => q._id);

        // Create session
        const session = await InterviewSession.create({
            user: req.user._id,
            company,
            role,
            difficulty: difficulty || 'Medium',
            questions: questionIds,
            status: 'InProgress'
        });

        res.status(201).json({
            status: 'success',
            data: {
                session,
                // Send the questions without the sample answers/keywords to the client
                questions: questions.map(q => ({
                    _id: q._id,
                    text: q.text,
                    type: q.type,
                    difficulty: q.difficulty,
                    options: q.options || []
                }))
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Submit an answer for evaluation
// @route   POST /api/interviews/:sessionId/submit
// @access  Private
const submitAnswer = async (req, res, next) => {
    try {
        const { questionId, answerText } = req.body;

        if (!questionId || !answerText) {
            return res.status(400).json({ status: 'error', message: 'Question ID and answer text are required' });
        }

        // Verify session
        const session = await InterviewSession.findOne({
            _id: req.params.sessionId,
            user: req.user._id,
        });

        if (!session) {
            return res.status(404).json({ status: 'error', message: 'Interview session not found' });
        }

        // Verify question is part of session
        if (!session.questions.includes(questionId)) {
            return res.status(400).json({ status: 'error', message: 'Question does not belong to this session' });
        }

        // Fetch question to get evaluation keywords and sample answer
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({ status: 'error', message: 'Original question not found' });
        }

        // Evaluate Answer using generic AI stub
        const evaluation = await aiEvaluationService.evaluateAnswer(
            question.text,
            question.sampleAnswer,
            question.evaluationKeywords,
            answerText
        );

        // Save Answer
        const answer = await Answer.create({
            session: session._id,
            question: question._id,
            user: req.user._id,
            answerText,
            score: evaluation.score,
            feedback: evaluation.feedback
        });

        // Check if interview is finished (all questions answered)
        const answersCount = await Answer.countDocuments({ session: session._id });
        if (answersCount >= session.questions.length) {
            session.status = 'Completed';
            session.completedAt = Date.now();
            await session.save();
        }

        res.status(201).json({
            status: 'success',
            data: {
                score: evaluation.score,
                feedback: evaluation.feedback,
                isCompleted: session.status === 'Completed'
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get interview session results
// @route   GET /api/interviews/:sessionId/results
// @access  Private
const getSessionResults = async (req, res, next) => {
    try {
        const session = await InterviewSession.findOne({
            _id: req.params.sessionId,
            user: req.user._id,
        }).populate('questions', 'text type difficulty');

        if (!session) {
            return res.status(404).json({ status: 'error', message: 'Session not found' });
        }

        const answers = await Answer.find({ session: session._id }).populate('question', 'text');

        // Calculate a naive confidence score
        const avgScore = session.totalScore;
        let confidence = 'Needs Practice';
        if (avgScore >= 80) confidence = 'Strong Hire';
        else if (avgScore >= 50) confidence = 'Potential Hire';

        res.status(200).json({
            status: 'success',
            data: {
                sessionDetails: {
                    company: session.company,
                    role: session.role,
                    difficulty: session.difficulty,
                    status: session.status,
                    totalScore: session.totalScore,
                    confidence,
                    startedAt: session.startedAt,
                    completedAt: session.completedAt,
                },
                answersFeedback: answers.map(a => ({
                    question: a.question.text,
                    userAnswer: a.answerText,
                    score: a.score,
                    feedback: a.feedback
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    startInterview,
    submitAnswer,
    getSessionResults
};
