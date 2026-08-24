const Joi = require('joi');
const Question = require('../models/Question');

// Validation Schemas
const questionSchema = Joi.object({
    company: Joi.string().required(),
    role: Joi.string().required(),
    difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').required(),
    type: Joi.string().valid('Technical', 'HR', 'Aptitude').required(),
    text: Joi.string().required(),
    sampleAnswer: Joi.string().required(),
    evaluationKeywords: Joi.array().items(Joi.string()).min(1).required(),
});

// @desc    Get all questions (with optional filters: company, role, difficulty)
// @route   GET /api/questions
// @access  Public (or could be Private depending on requirement, usually we fetch randomly in interview but let admin see all)
const getQuestions = async (req, res, next) => {
    try {
        const { company, role, difficulty } = req.query;

        // Build query
        const query = {};
        if (company) query.company = new RegExp(company, 'i');
        if (role) query.role = new RegExp(role, 'i');
        if (difficulty) query.difficulty = difficulty;

        const questions = await Question.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            count: questions.length,
            data: questions
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private/Admin
const getQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ status: 'error', message: 'Question not found' });
        }

        res.status(200).json({ status: 'success', data: question });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res, next) => {
    try {
        const { error } = questionSchema.validate(req.body);
        if (error) return res.status(400).json({ status: 'error', message: error.details[0].message });

        const question = await Question.create(req.body);
        res.status(201).json({ status: 'success', data: question });
    } catch (error) {
        next(error);
    }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res, next) => {
    try {
        // Optional chaining text/roles to update selectively, skipping full Joi validation for brevity here,
        // though ideally you'd have an update schema.
        let question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ status: 'error', message: 'Question not found' });
        }

        question = await Question.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ status: 'success', data: question });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ status: 'error', message: 'Question not found' });
        }

        await question.deleteOne();

        res.status(200).json({ status: 'success', data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion
};
