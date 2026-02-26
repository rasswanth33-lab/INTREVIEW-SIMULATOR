const express = require('express');
const router = express.Router();
const { startInterview, submitAnswer, getSessionResults } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startInterview);
router.post('/:sessionId/submit', protect, submitAnswer);
router.get('/:sessionId/results', protect, getSessionResults);

module.exports = router;
