const express = require('express');
const router = express.Router();
const { startInterview, submitAnswer, getSessionResults } = require('../controllers/interviewController');
const { guestUser } = require('../middleware/guestUser');

router.post('/start', guestUser, startInterview);
router.post('/:sessionId/submit', guestUser, submitAnswer);
router.get('/:sessionId/results', guestUser, getSessionResults);

module.exports = router;
