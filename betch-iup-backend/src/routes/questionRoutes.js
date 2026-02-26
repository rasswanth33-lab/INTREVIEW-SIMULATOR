const express = require('express');
const router = express.Router();
const {
    getQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = require('../controllers/questionController');

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getQuestions)
    .post(protect, admin, createQuestion);

router.route('/:id')
    .get(protect, admin, getQuestion)
    .put(protect, admin, updateQuestion)
    .delete(protect, admin, deleteQuestion);

module.exports = router;
